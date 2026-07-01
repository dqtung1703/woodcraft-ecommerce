<?php


namespace App\Services;

use App\DTOs\Voucher\CreateVoucherDTO;
use App\Exceptions\VoucherException;
use App\Models\Voucher;
use App\Models\VoucherUsage;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

final class VoucherService
{
    /**
     * [PUBLIC] Kiểm tra & preview voucher trước khi đặt hàng
     * Không trừ used_count — chỉ validate và trả về discount amount
     */
    public function applyPreview(string $code, int $userId, float $orderTotal): array
    {
        $voucher = $this->findValidVoucher($code, $userId, $orderTotal);

        $discountAmount = $voucher->calcDiscount($orderTotal);

        return [
            'code'            => $voucher->code,
            'discount_type'   => $voucher->discount_type,
            'discount_value'  => (float) $voucher->discount_value,
            'discount_amount' => round($discountAmount, 2),
            'final_total'     => round(max(0, $orderTotal - $discountAmount), 2),
        ];
    }

    /**
     * [ADMIN] Lấy danh sách tất cả voucher (có filter)
     */
    public function adminList(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Voucher::query()->latest();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where('code', 'like', '%' . $filters['search'] . '%');
        }

        return $query->paginate($perPage);
    }

    /**
     * [ADMIN] Tạo voucher mới
     */
    public function create(CreateVoucherDTO $dto): Voucher
    {
        // Kiểm tra code trùng
        if (Voucher::where('code', strtoupper($dto->code))->exists()) {
            throw VoucherException::codeAlreadyExists();
        }

        $voucher = Voucher::create([
            'code'           => strtoupper($dto->code),
            'discount_type'  => $dto->discountType,
            'discount_value' => $dto->discountValue,
            'min_order_value'=> $dto->minOrderValue,
            'max_discount'   => $dto->maxDiscount,
            'quantity'       => $dto->quantity,
            'used_count'     => 0,
            'per_user_limit' => $dto->perUserLimit,
            'start_date'     => $dto->startDate,
            'end_date'       => $dto->endDate,
            'status'         => 'active',
        ]);

        Log::info('Voucher created', [
            'code'     => $voucher->code,
            'quantity' => $voucher->quantity,
        ]);

        return $voucher;
    }

    /**
     * [ADMIN] Cập nhật voucher
     */
    public function update(int $id, array $data): Voucher
    {
        $voucher = $this->findOrFail($id);

        // Không cho phép giảm quantity xuống dưới used_count
        if (isset($data['quantity']) && $data['quantity'] < $voucher->used_count) {
            throw VoucherException::quantityBelowUsedCount();
        }

        // Nếu đổi code, check trùng
        if (!empty($data['code'])) {
            $newCode = strtoupper($data['code']);
            if ($newCode !== $voucher->code && Voucher::where('code', $newCode)->exists()) {
                throw VoucherException::codeAlreadyExists();
            }
            $data['code'] = $newCode;
        }

        $updateData = [];
        foreach ($data as $key => $value) {
            $updateData[$key] = $value;
        }
        $voucher->update($updateData);

        Log::info('Voucher updated', ['id' => $id, 'changes' => $voucher->getChanges()]);

        return $voucher->fresh();
    }

    /**
     * [ADMIN] Xóa voucher (chỉ xóa được nếu chưa có ai dùng)
     */
    public function delete(int $id): void
    {
        $voucher = $this->findOrFail($id);

        if ($voucher->used_count > 0) {
            throw VoucherException::cannotDeleteUsed();
        }

        $voucher->delete();

        Log::info('Voucher deleted', ['code' => $voucher->code]);
    }

    /**
     * [ADMIN] Toggle trạng thái active/inactive
     */
    public function toggleStatus(int $id): Voucher
    {
        $voucher = $this->findOrFail($id);

        $newStatus = $voucher->status === 'active' ? 'inactive' : 'active';
        $voucher->update(['status' => $newStatus]);

        Log::info('Voucher status toggled', [
            'code'   => $voucher->code,
            'status' => $newStatus,
        ]);

        return $voucher->fresh();
    }

    // ─── Internal helpers ──────────────────────────────────────────────────────

    /**
     * Validate voucher đầy đủ — dùng chung cho applyPreview và OrderService
     * Throw exception cụ thể cho từng trường hợp
     */
    public function findValidVoucher(string $code, int $userId, float $orderTotal): Voucher
    {
        $voucher = Voucher::where('code', strtoupper($code))->first();

        if (!$voucher) {
            throw VoucherException::notFound();
        }

        // Kiểm tra hết lượt
        if ($voucher->used_count >= $voucher->quantity) {
            throw VoucherException::exhausted();
        }

        // Kiểm tra status và thời gian
        if (
            $voucher->status !== 'active'
            || ($voucher->start_date && $voucher->start_date > now())
            || ($voucher->end_date && $voucher->end_date < now())
        ) {
            throw VoucherException::expired();
        }

        // Kiểm tra giá trị đơn tối thiểu
        if ($orderTotal < $voucher->min_order_value) {
            throw VoucherException::belowMinOrder($voucher->min_order_value);
        }

        // Kiểm tra giới hạn per-user
        if ($voucher->per_user_limit) {
            $usedCount = VoucherUsage::where('voucher_id', $voucher->id)
                ->where('user_id', $userId)
                ->count();

            if ($usedCount >= $voucher->per_user_limit) {
                throw VoucherException::userLimitReached();
            }
        }

        return $voucher;
    }

    private function findOrFail(int $id): Voucher
    {
        $voucher = Voucher::find($id);

        if (!$voucher) {
            throw VoucherException::notFound();
        }

        return $voucher;
    }
}
