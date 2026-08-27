/**
 * Real Firebase Firestore Database Service
 * Provides durable cloud persistence, real-time live synchronization via onSnapshot,
 * and structured error diagnostics with handleFirestoreError.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Product, Order, CategoryInfo, OrderStatus, TrackingEvent } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || false,
      isAnonymous: auth.currentUser?.isAnonymous || false,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export type Unsubscribe = () => void;

/**
 * Validates connection to Firestore on initial boot using getDocFromServer
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    return false;
  }
}

// ---------------- PRODUCTS ----------------

const PRODUCTS_COLLECTION = 'products';

export function subscribeToProducts(
  onProductsUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((d) => {
        prods.push(d.data() as Product);
      });
      if (prods.length === 0) {
        onProductsUpdate(INITIAL_PRODUCTS);
      } else {
        onProductsUpdate(prods);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
      } catch (e) {
        if (onError) onError(e);
        onProductsUpdate([]);
      }
    }
  );
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchAllProductsFromFirestore(): Promise<Product[]> {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const prods: Product[] = [];
    snapshot.forEach((d) => {
      prods.push(d.data() as Product);
    });
    return prods.length > 0 ? prods : INITIAL_PRODUCTS;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- ORDERS ----------------

const ORDERS_COLLECTION = 'orders';

export function subscribeToOrders(
  onOrdersUpdate: (orders: Order[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((d) => {
        ordersList.push(d.data() as Order);
      });
      onOrdersUpdate(ordersList);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      } catch (e) {
        if (onError) onError(e);
      }
    }
  );
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${order.id}`;
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: OrderStatus,
  trackingEvents: TrackingEvent[]
): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
      status,
      trackingEvents,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- CATEGORIES ----------------

const CATEGORIES_COLLECTION = 'categories';

export function subscribeToCategories(
  onCategoriesUpdate: (categories: CategoryInfo[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: CategoryInfo[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as CategoryInfo);
      });
      if (list.length === 0) {
        onCategoriesUpdate(CATEGORIES);
      } else {
        onCategoriesUpdate(list);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, CATEGORIES_COLLECTION);
      } catch (e) {
        if (onError) onError(e);
        onCategoriesUpdate(CATEGORIES);
      }
    }
  );
}

export async function saveCategoryToFirestore(category: CategoryInfo): Promise<void> {
  const path = `${CATEGORIES_COLLECTION}/${category.id}`;
  try {
    await setDoc(doc(db, CATEGORIES_COLLECTION, category.id), category);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCategoryFromFirestore(categoryId: string): Promise<void> {
  const path = `${CATEGORIES_COLLECTION}/${categoryId}`;
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
