import {
  BookHeart, Plus, QrCode, Camera, Utensils, Car, Music, Flower2,
  MapPin, Phone, MessageCircle, Heart, CalendarDays, Image as ImageIcon, Lightbulb,
  Building2, UtensilsCrossed, Mic2, Mail, Instagram, Facebook
} from "lucide-react";

export type IconName = "BookHeart" | "Plus" | "QrCode" | "Camera" | "Utensils" | "Car" | "Music" | "Flower2" | "MapPin" | "Phone" | "MessageCircle" | "Heart" | "CalendarDays" | "Image" | "Lightbulb" | "Building2" | "UtensilsCrossed" | "Mic2" | "Mail" | "Instagram" | "Facebook";

const iconMap: Record<string, React.ElementType> = {
  BookHeart, Plus, QrCode, Camera, Utensils, Car, Music, Flower2,
  MapPin, Phone, MessageCircle, Heart, CalendarDays, Image: ImageIcon, Lightbulb,
  Building2, UtensilsCrossed, Mic2, Mail, Instagram, Facebook
};

export function Icon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Component = iconMap[name];
  if (!Component) return null;
  return <Component className={className} style={style} />;
}
