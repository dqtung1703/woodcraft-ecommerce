<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDiscount;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class RealCraftProductSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->products() as $item) {
            $category = Category::updateOrCreate(
                ['name' => $item['category']],
                ['description' => $item['category_description']]
            );

            $product = Product::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'] . "\n\nNguon tham khao: " . $item['source_url'],
                    'original_price' => $item['original_price'],
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                    'material' => $item['material'],
                    'category_id' => $category->id,
                ]
            );

            ProductImage::where('product_id', $product->id)->delete();

            foreach ($item['images'] as $imageUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imageUrl,
                ]);
            }

            ProductDiscount::where('product_id', $product->id)->delete();

            if ($item['original_price'] > $item['price']) {
                ProductDiscount::create([
                    'product_id' => $product->id,
                    'discount_type' => 'fixed',
                    'discount_value' => $item['original_price'] - $item['price'],
                    'start_date' => now()->subDay(),
                    'end_date' => now()->addMonths(6),
                    'status' => 'active',
                ]);
            }
        }
    }

    /**
     * Product facts and public image URLs were collected from the supplied websites.
     *
     * @return array<int, array<string, mixed>>
     */
    private function products(): array
    {
        return [
            [
                'name' => 'Tu kham trai oc go gu ta bay do',
                'category' => 'Tu kham trai',
                'category_description' => 'Tu che, tu bay do va tu trang tri kham trai oc cao cap.',
                'description' => 'Tu bay do bang go gu ta, kham oc tren canh va ngan keo voi cac tich truyen thong. Kich thuoc tham khao 107x121x46cm, phu hop phong khach hoac khong gian suu tam.',
                'material' => 'Go gu ta, kham oc',
                'original_price' => 75000000,
                'price' => 75000000,
                'stock' => 2,
                'source_url' => 'https://khamtrai.vn/tu-kham-trai-tu-dung-do-tu-trang-tri.html',
                'images' => [
                    'https://khamtrai.vn/img_data/images/tu-kham-oc-(1).jpg',
                    'http://khamtrai.vn/img_data/images/T%E1%BB%A7%20kh%E1%BA%A3m%20trai%20%E1%BB%91c/tu%20kham%20oc%20(15).jpg',
                ],
            ],
            [
                'name' => 'Tu che go gu kham oc do Singapore',
                'category' => 'Tu kham trai',
                'category_description' => 'Tu che, tu bay do va tu trang tri kham trai oc cao cap.',
                'description' => 'Tu che go gu kham oc do Singapore, hoa tiet day dac, thich hop lam diem nhan phong khach truyen thong.',
                'material' => 'Go gu, kham oc do Singapore',
                'original_price' => 220000000,
                'price' => 200000000,
                'stock' => 1,
                'source_url' => 'https://khamtrai.vn/tu-che-go-gu-kham-oc-do-singgapore.html',
                'images' => [
                    'https://khamtrai.vn/img_data/images/tu-che-go-gu-kham-oc-(9).jpg',
                ],
            ],
            [
                'name' => 'Tu tho go gu kham oc Singapore tranh dong que',
                'category' => 'Ban tho va tu tho',
                'category_description' => 'Ban tho, tu tho, sap tho go tu nhien cho khong gian tho cung.',
                'description' => 'Tu tho go gu kham oc Singapore, mat 145x60cm, cao 146cm, chu de tranh dong que. San pham phu hop phong tho gia dinh.',
                'material' => 'Go gu, kham oc Singapore',
                'original_price' => 120000000,
                'price' => 120000000,
                'stock' => 1,
                'source_url' => 'https://moclaxuyen.com/products/tu-tho-go-gu-kham-oc-singapore-kich-thuoc-mat-145x60-cao-146cm-tranh-dong-que?variant=1121932154',
                'images' => [
                    'https://product.hstatic.net/200000845975/product/1_ad134090919142e59d72df872c87681a.png',
                    'https://product.hstatic.net/200000845975/product/2_result_40396d14cf2d47b7bf96ac845948a6cf.png',
                    'https://product.hstatic.net/200000845975/product/3_result_10117250cb4941e8b6a0ea7cd0ee619d.png',
                ],
            ],
            [
                'name' => 'Ke tivi go kham trai',
                'category' => 'Ke tivi',
                'category_description' => 'Ke tivi go tu nhien, phong cach co dien va ban co dien.',
                'description' => 'Ke tivi go kham trai cho phong khach, thiet ke thap, de phoi voi sofa go va tu che.',
                'material' => 'Go tu nhien, kham trai',
                'original_price' => 11000000,
                'price' => 11000000,
                'stock' => 3,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'Khay nuoc kham trai',
                'category' => 'Khay tra kham trai',
                'category_description' => 'Khay tra, khay nuoc va phu kien tiep khach kham trai oc.',
                'description' => 'Khay nuoc go kham trai nho gon, dung tren ban tra phong khach hoac lam qua tang thu cong.',
                'material' => 'Go, kham trai',
                'original_price' => 650000,
                'price' => 650000,
                'stock' => 12,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'Khay tra dao kham trai',
                'category' => 'Khay tra kham trai',
                'category_description' => 'Khay tra, khay nuoc va phu kien tiep khach kham trai oc.',
                'description' => 'Khay tra dao bang go kham trai, phu hop bo am chen va khong gian thuong tra.',
                'material' => 'Go, kham trai',
                'original_price' => 500000,
                'price' => 500000,
                'stock' => 15,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'Trap trau kham oc',
                'category' => 'Hop va trap kham trai',
                'category_description' => 'Hop go, trap trau, trap trang tri kham trai oc.',
                'description' => 'Trap trau go kham oc, hoa tiet truyen thong, dung trong trung bay, le nghi hoac suu tam.',
                'material' => 'Go, kham oc',
                'original_price' => 30000000,
                'price' => 30000000,
                'stock' => 2,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'Sap gu tu che kham trai',
                'category' => 'Sap gu kham trai',
                'category_description' => 'Sap gu, sap go va bo sap tu che kham trai oc.',
                'description' => 'Bo sap gu tu che kham trai cho phong khach lon, chat lieu go gu va hoa tiet kham truyen thong.',
                'material' => 'Go gu, kham trai',
                'original_price' => 150000000,
                'price' => 150000000,
                'stock' => 1,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'Sap gu kham trai cao cap',
                'category' => 'Sap gu kham trai',
                'category_description' => 'Sap gu, sap go va bo sap tu che kham trai oc.',
                'description' => 'Sap gu kham trai ban lon, duong net kham phu hop khong gian phong khach truyen thong.',
                'material' => 'Go gu, kham trai',
                'original_price' => 170000000,
                'price' => 170000000,
                'stock' => 1,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'Sap gu kham trai oc dac biet',
                'category' => 'Sap gu kham trai',
                'category_description' => 'Sap gu, sap go va bo sap tu che kham trai oc.',
                'description' => 'Mau sap gu kham trai oc gia tri cao, danh cho khong gian suu tam hoac nha go truyen thong.',
                'material' => 'Go gu, kham trai oc',
                'original_price' => 400000000,
                'price' => 400000000,
                'stock' => 1,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'Ban tho go gu',
                'category' => 'Ban tho va tu tho',
                'category_description' => 'Ban tho, tu tho, sap tho go tu nhien cho khong gian tho cung.',
                'description' => 'Ban tho go gu thiet ke co dien, chat lieu go tu nhien, phu hop khong gian tho gia dinh.',
                'material' => 'Go gu',
                'original_price' => 18000000,
                'price' => 18000000,
                'stock' => 4,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'Tu tho go huong',
                'category' => 'Ban tho va tu tho',
                'category_description' => 'Ban tho, tu tho, sap tho go tu nhien cho khong gian tho cung.',
                'description' => 'Tu tho go huong, mau sac am, van go noi ro, thich hop can ho va nha pho.',
                'material' => 'Go huong',
                'original_price' => 28000000,
                'price' => 28000000,
                'stock' => 2,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'Gio go trac kham oc Singapore',
                'category' => 'Lo che kham trai',
                'category_description' => 'Lo che, ong che va gio go kham oc dung cho khong gian thuong tra.',
                'description' => 'Gio go trac kham oc Singapore, kich thuoc gon, gia tri trang tri cao cho phong tra.',
                'material' => 'Go trac, kham oc Singapore',
                'original_price' => 40000000,
                'price' => 40000000,
                'stock' => 2,
                'source_url' => 'https://khamtrai.vn/',
                'images' => [],
            ],
            [
                'name' => 'An gian tho trien phuc tho go gu Lao',
                'category' => 'An gian tho',
                'category_description' => 'An gian tho go tu nhien, hang duc tay cho phong tho cao cap.',
                'description' => 'An gian tho mau trien phuc tho, chat lieu go gu Lao, hang duc tay cho phong tho rong.',
                'material' => 'Go gu Lao',
                'original_price' => 23000000,
                'price' => 20000000,
                'stock' => 3,
                'source_url' => 'https://dogothanhtung.vn/danh-muc/an-gian-tho',
                'images' => [
                    'https://dogothanhtung.vn/wp-content/uploads/2021/08/tu-tho-go-huong-do-nam-phi-4.jpg',
                ],
            ],
            [
                'name' => 'An gian tho tu quy 1m97 go gu Lao',
                'category' => 'An gian tho',
                'category_description' => 'An gian tho go tu nhien, hang duc tay cho phong tho cao cap.',
                'description' => 'An gian tho tu quy kich thuoc 1m97, go gu Lao, phong cach cham khac truyen thong.',
                'material' => 'Go gu Lao',
                'original_price' => 21000000,
                'price' => 19000000,
                'stock' => 3,
                'source_url' => 'https://dogothanhtung.vn/danh-muc/an-gian-tho',
                'images' => [
                    'https://dogothanhtung.vn/wp-content/uploads/2021/08/tu-tho-go-huong-do-nam-phi-4.jpg',
                ],
            ],
            [
                'name' => 'An gian tho ngu phuc kim tien go huong da',
                'category' => 'An gian tho',
                'category_description' => 'An gian tho go tu nhien, hang duc tay cho phong tho cao cap.',
                'description' => 'An gian tho ngu phuc kim tien kich thuoc 1m97, go huong da, phu hop phong tho gia dinh.',
                'material' => 'Go huong da',
                'original_price' => 23000000,
                'price' => 21000000,
                'stock' => 3,
                'source_url' => 'https://dogothanhtung.vn/danh-muc/an-gian-tho',
                'images' => [
                    'https://dogothanhtung.vn/wp-content/uploads/2021/08/tu-tho-go-huong-do-nam-phi-4.jpg',
                ],
            ],
            [
                'name' => 'Combo noi that phong tho go cao cap',
                'category' => 'Combo noi that phong tho',
                'category_description' => 'Bo combo phong tho gom an gian, hoanh phi, cau doi va phu kien dong bo.',
                'description' => 'Combo noi that phong tho cao cap cho gia dinh, gom cac hang muc dong bo theo phong cach go truyen thong.',
                'material' => 'Go tu nhien',
                'original_price' => 120000000,
                'price' => 115000000,
                'stock' => 1,
                'source_url' => 'https://dogothanhtung.vn/danh-muc/an-gian-tho',
                'images' => [
                    'https://dogothanhtung.vn/wp-content/uploads/2021/04/sap_go_banner.jpg',
                ],
            ],
        ];
    }
}
