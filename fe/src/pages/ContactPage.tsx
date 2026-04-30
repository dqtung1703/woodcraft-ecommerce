import { Clock, Loader2, Mail, MapPin, Phone, Send, UserRound } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import heroImage from '@/assets/heritage/village.png';

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactForm, string>>;

const initialForm: ContactForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const contactItems = [
  {
    title: 'Địa chỉ',
    value: 'Chuyên Mỹ, Phú Xuyên, Hà Nội',
    icon: MapPin,
  },
  {
    title: 'Số điện thoại',
    value: '0123 456 789',
    href: 'tel:0123456789',
    icon: Phone,
  },
  {
    title: 'Email',
    value: 'support@example.com',
    href: 'mailto:support@example.com',
    icon: Mail,
  },
  {
    title: 'Giờ làm việc',
    value: '8:00 - 17:30, Thứ 2 - Chủ nhật',
    icon: Clock,
  },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(0|\+84)[0-9\s.-]{8,13}$/;

function validate(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};

  if (!form.name.trim()) {
    errors.name = 'Vui lòng nhập họ và tên.';
  }

  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Email chưa đúng định dạng.';
  }

  if (form.phone.trim() && !phoneRegex.test(form.phone.trim())) {
    errors.phone = 'Số điện thoại chưa đúng định dạng.';
  }

  if (!form.subject.trim()) {
    errors.subject = 'Vui lòng nhập chủ đề.';
  }

  if (!form.message.trim()) {
    errors.message = 'Vui lòng nhập nội dung tin nhắn.';
  }

  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const mapSrc = useMemo(
    () => 'https://www.google.com/maps?q=Chuy%C3%AAn%20M%E1%BB%B9%2C%20Ph%C3%BA%20Xuy%C3%AAn%2C%20H%C3%A0%20N%E1%BB%99i&output=embed',
    [],
  );

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSuccessMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    window.setTimeout(() => {
      setIsSubmitting(false);
      setForm(initialForm);
      setSuccessMessage('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.');
    }, 900);
  };

  return (
    <div className="bg-background">
      <section className="relative min-h-[420px] overflow-hidden flex items-end">
        <img
          src={heroImage}
          alt="Làng nghề gỗ khảm trai Chuyên Mỹ"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-20 text-white">
          <span className="uppercase tracking-[0.38em] text-primary-container text-xs font-bold">
            Chuyên Mỹ Artisan
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl md:text-6xl font-serif leading-tight">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-5 max-w-2xl text-white/85 text-base md:text-lg leading-relaxed">
            Chúng tôi luôn sẵn sàng tư vấn sản phẩm, hỗ trợ đặt hàng và giải đáp mọi thắc mắc của quý khách.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">{item.title}</h2>
                  <p className="font-semibold text-on-surface leading-relaxed">{item.value}</p>
                </div>
              </>
            );

            return item.href ? (
              <a
                key={item.title}
                href={item.href}
                className="bg-white border border-outline-variant/30 rounded-2xl p-5 flex gap-4 hover:border-primary/50 hover:shadow-md transition-all"
              >
                {content}
              </a>
            ) : (
              <div key={item.title} className="bg-white border border-outline-variant/30 rounded-2xl p-5 flex gap-4">
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 md:p-8">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.28em] text-primary font-bold">Gửi lời nhắn</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-serif text-on-surface">Cần tư vấn sản phẩm?</h2>
              <p className="mt-3 text-sm md:text-base text-on-surface-variant leading-relaxed">
                Hãy để lại thông tin, đội ngũ Chuyên Mỹ Artisan sẽ liên hệ lại để hỗ trợ lựa chọn mẫu mã, kích thước và phương án giao hàng phù hợp.
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5" noValidate>
              <Field
                label="Họ và tên"
                value={form.name}
                error={errors.name}
                icon={<UserRound className="w-4 h-4" />}
                onChange={(value) => updateField('name', value)}
                placeholder="Nguyễn Văn A"
                required
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                error={errors.email}
                icon={<Mail className="w-4 h-4" />}
                onChange={(value) => updateField('email', value)}
                placeholder="email@example.com"
                required
              />
              <Field
                label="Số điện thoại"
                value={form.phone}
                error={errors.phone}
                icon={<Phone className="w-4 h-4" />}
                onChange={(value) => updateField('phone', value)}
                placeholder="0123 456 789"
              />
              <Field
                label="Chủ đề"
                value={form.subject}
                error={errors.subject}
                icon={<Send className="w-4 h-4" />}
                onChange={(value) => updateField('subject', value)}
                placeholder="Tư vấn tủ thờ khảm trai"
                required
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="contact-message">
                  Nội dung tin nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  rows={6}
                  className={`w-full resize-none rounded-xl border bg-surface-container-low px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary ${
                    errors.message ? 'border-red-300' : 'border-outline-variant'
                  }`}
                  placeholder="Quý khách cần tư vấn sản phẩm, kích thước, chất liệu hoặc thời gian giao hàng..."
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <p className="mt-2 text-xs font-medium text-red-600">{errors.message}</p>}
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSubmitting ? 'Đang gửi...' : 'Gửi liên hệ'}
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden">
              <div className="h-[360px] bg-surface-container-low">
                <iframe
                  title="Bản đồ cửa hàng"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                />
              </div>
              <div className="p-5">
                <h2 className="font-serif text-xl text-on-surface">Bản đồ cửa hàng</h2>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  Khu vực làng nghề Chuyên Mỹ, Phú Xuyên, Hà Nội. Quý khách nên liên hệ trước khi ghé để được chuẩn bị mẫu sản phẩm phù hợp.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-primary text-white p-6">
              <h2 className="font-serif text-2xl">Tư vấn theo yêu cầu</h2>
              <p className="mt-3 text-sm text-white/85 leading-relaxed">
                Với sản phẩm đặt riêng, chúng tôi có thể trao đổi về kích thước, hoa văn, chất liệu gỗ và thời gian hoàn thiện theo không gian thờ tự hoặc trưng bày của gia đình.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  icon,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: ReactNode;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  const id = `contact-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-surface-container-low py-3 pl-11 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary ${
            error ? 'border-red-300' : 'border-outline-variant'
          }`}
          aria-invalid={Boolean(error)}
        />
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
