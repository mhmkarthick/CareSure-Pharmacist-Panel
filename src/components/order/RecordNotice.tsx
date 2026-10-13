import React from "react";
import { SearchXIcon, BoxIcon } from "lucide-react";
import { EmptyState } from "../ui/EmptyState";
import { ButtonLink } from "../ui/ButtonLink";
interface RecordNoticeProps {
  title: string;
  message: string;
  to: string;
  actionLabel: string;
  icon?: BoxIcon;
}
export function RecordNotice({
  title,
  message,
  to,
  actionLabel,
  icon = SearchXIcon
}: RecordNoticeProps) {
  return <div className="flex min-h-[60vh] items-center justify-center rounded-[10px] border border-line bg-white">
      <EmptyState icon={icon} title={title} message={message} action={<ButtonLink to={to} variant="primary">{actionLabel}</ButtonLink>} />
    </div>;
}