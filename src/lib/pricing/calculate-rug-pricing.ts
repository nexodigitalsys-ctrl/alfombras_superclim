import type { PricingRule } from "@/features/pricing/types/pricing-rule";
import type { ServiceType, SizeCategory } from "@/types/domain";

export type CalculateRugPricingInput = {
  widthCm: number;
  lengthCm: number;
  sizeCategory: SizeCategory;
  serviceType: ServiceType;
  includesCleaning: boolean;
  includesDelivery: boolean;
  entryDate: string;
  expectedExitDate: string | null;
  actualExitDate: string | null;
  rule: PricingRule | null;
};

export type CalculatedRugPricing = {
  months: number;
  areaM2: number;
  basePrice: number;
  storagePrice: number;
  extraPrice: number;
  totalPrice: number;
};

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getStorageMonths(
  entryDate: string,
  expectedExitDate: string | null,
  actualExitDate: string | null,
): number {
  if (!entryDate) {
    return 0;
  }

  const start = new Date(entryDate);
  const end = new Date(actualExitDate || expectedExitDate || entryDate);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diffInDays = Math.max(
    0,
    Math.ceil((end.getTime() - start.getTime()) / millisecondsPerDay),
  );

  return Math.max(1, Math.ceil(diffInDays / 30));
}

export function calculateRugPricing(
  input: CalculateRugPricingInput,
): CalculatedRugPricing {
  const areaM2 = roundMoney((input.widthCm * input.lengthCm) / 10000);
  const months = getStorageMonths(
    input.entryDate,
    input.expectedExitDate,
    input.actualExitDate,
  );

  if (!input.rule) {
    return {
      months,
      areaM2,
      basePrice: 0,
      storagePrice: 0,
      extraPrice: 0,
      totalPrice: 0,
    };
  }

  const basePrice = roundMoney(
    input.rule.base_price + areaM2 * input.rule.price_per_m2,
  );
  const storagePrice = roundMoney(
    months * 30 * input.rule.storage_daily_price,
  );
  const extraPrice = roundMoney(
    input.rule.extra_price +
      (input.includesCleaning ? input.rule.cleaning_price : 0) +
      (input.includesDelivery ? input.rule.delivery_price : 0),
  );
  const totalPrice = roundMoney(basePrice + storagePrice + extraPrice);

  return {
    months,
    areaM2,
    basePrice,
    storagePrice,
    extraPrice,
    totalPrice,
  };
}
