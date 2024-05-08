import { cn } from '@/lib/utils';

export const Spinner = () => {
  return (
    <div className='h-10 w-10 animate-spin rounded-full border-8 border-solid border-foreground/25 border-r-primary duration-500'></div>
  );
};

export const BlockSpinner = ({ bg }: { bg?: boolean }) => {
  return (
    <div
      className={cn(
        'h- z-50 grid h-full w-full place-content-center',
        bg && 'bg-group',
      )}
    >
      <Spinner />
    </div>
  );
};
