type Props = { size?: 'sm' | 'md' | 'lg' };

export default function LoadingSpinner({ size = 'md' }: Props) {
  const s = { sm: 'w-6 h-6 border-2', md: 'w-10 h-10 border-4', lg: 'w-16 h-16 border-4' }[size];
  return <div className={`${s} border-surface-container-high border-t-primary rounded-full animate-spin`} />;
}
