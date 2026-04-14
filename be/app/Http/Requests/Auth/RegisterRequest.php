// =============================================
// app/Http/Requests/Auth/RegisterRequest.php
// =============================================
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required'],
            'phone'                 => ['nullable', 'string', 'regex:/^[0-9]{10,11}$/'],
            'address'               => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Vui lòng nhập họ tên.',
            'email.required'    => 'Vui lòng nhập email.',
            'email.email'       => 'Email không hợp lệ.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min'      => 'Mật khẩu tối thiểu 8 ký tự.',
            'password.confirmed'=> 'Mật khẩu xác nhận không khớp.',
            'phone.regex'       => 'Số điện thoại không hợp lệ.',
        ];
    }
}