import formatDatetime from "@utils/formatDatetime";

export interface Props {
  datetime: string;
  className?: string;
}

export default function Datetime({ datetime, className }: Props) {
  return (
    <div className={`opacity-80 flex items-center space-x-2 ${className}`}>
      <span className={`italic xs`}>
        {formatDatetime(datetime)}
      </span>
    </div>
  );
}