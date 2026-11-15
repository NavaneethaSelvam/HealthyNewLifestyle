import { Address, CustomerProfile } from "@/types/storefront";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "./storage";

export const DEFAULT_CUSTOMER: CustomerProfile = {
  id: "",
  fullName: "",
  email: "",
  mobile: "",
  joinedDate: "",
  preferredLanguage: "English",
};

export function getCustomerProfile(): CustomerProfile {
  return getStorageItem<CustomerProfile>(STORAGE_KEYS.USER, DEFAULT_CUSTOMER);
}

export function updateCustomerProfile(updates: Partial<CustomerProfile>): CustomerProfile {
  const current = getCustomerProfile();
  const updated: CustomerProfile = { ...current, ...updates };
  setStorageItem(STORAGE_KEYS.USER, updated);
  return updated;
}

export function getAddresses(): Address[] {
  const stored = getStorageItem<Address[]>(STORAGE_KEYS.ADDRESSES, []);
  if (!Array.isArray(stored)) return [];

  const addresses = stored.filter(
    (address) => address.id !== "addr_01" && address.id !== "addr_02",
  );
  if (addresses.length !== stored.length) {
    setStorageItem(STORAGE_KEYS.ADDRESSES, addresses);
  }
  return addresses;
}

export function saveAddresses(addresses: Address[]): void {
  setStorageItem(STORAGE_KEYS.ADDRESSES, addresses);
}

export function addAddress(addressData: Omit<Address, "id">): Address {
  const current = getAddresses();
  const newId = `addr_${Date.now()}`;
  const isFirst = current.length === 0;
  const isDefault = addressData.isDefault || isFirst;

  let updatedList = current;
  if (isDefault) {
    updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
  }

  const newAddress: Address = {
    ...addressData,
    id: newId,
    isDefault,
  };

  updatedList = [...updatedList, newAddress];
  saveAddresses(updatedList);
  return newAddress;
}

export function updateAddress(id: string, updates: Partial<Address>): Address | null {
  const current = getAddresses();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return null;

  let updatedList = [...current];
  if (updates.isDefault) {
    updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
  }

  const updatedAddr: Address = {
    ...updatedList[index],
    ...updates,
  };
  updatedList[index] = updatedAddr;
  saveAddresses(updatedList);
  return updatedAddr;
}

export function deleteAddress(id: string): void {
  const current = getAddresses();
  const filtered = current.filter((a) => a.id !== id);
  // If we deleted default and items remain, make first one default
  if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
    filtered[0].isDefault = true;
  }
  saveAddresses(filtered);
}

export function setDefaultAddress(id: string): void {
  const current = getAddresses();
  const updated = current.map((a) => ({
    ...a,
    isDefault: a.id === id,
  }));
  saveAddresses(updated);
}

export function loginCustomer(identifier: string, name?: string): CustomerProfile {
  const current = getCustomerProfile();
  const isPhone = /^\+?[0-9]{10,12}$/.test(identifier.replace(/[\s-]/g, ""));
  const updated: CustomerProfile = {
    ...current,
    fullName: name || current.fullName,
    email: isPhone ? current.email : identifier,
    mobile: isPhone ? identifier : current.mobile,
  };
  setStorageItem(STORAGE_KEYS.USER, updated);
  return updated;
}
