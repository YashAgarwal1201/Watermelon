export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface CardProps extends BaseProps {
  title?: string;
  subtitle?: string;
  image?: string;
  actions?: React.ReactNode;
  variant?: "default" | "bordered" | "shadow";
}

export interface DashboardProps extends BaseProps {
  title?: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface MetricData {
  label: string;
  value: number | string;
  change?: number;
  color?: string;
}
