import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listingsApi } from '@/api/listingsApi';
import { Listing, ListingFormData, ListingFilters } from '@/types/listing.types';

interface ListingsState {
  items: Listing[];
  currentListing: Listing | null;
  isLoading: boolean;
  error: string | null;
  filters: ListingFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ListingsState = {
  items: [],
  currentListing: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    location: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Асинхронні дії для лістингів
export const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async (params: { filters?: ListingFilters; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await listingsApi.getListings(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання лістингів');
    }
  }
);

export const fetchListingById = createAsyncThunk(
  'listings/fetchListingById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await listingsApi.getListingById(id);
      return response.data.listing;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання даних лістингу');
    }
  }
);

export const createListing = createAsyncThunk(
  'listings/createListing',
  async (listingData: ListingFormData, { rejectWithValue }) => {
    try {
      const response = await listingsApi.createListing(listingData);
      return response.data.listing;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка створення лістингу');
    }
  }
);

export const updateListing = createAsyncThunk(
  'listings/updateListing',
  async ({ id, data }: { id: number; data: Partial<ListingFormData> }, { rejectWithValue }) => {
    try {
      const response = await listingsApi.updateListing(id, data);
      return response.data.listing;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка оновлення лістингу');
    }
  }
);

export const deleteListing = createAsyncThunk(
  'listings/deleteListing',
  async (id: number, { rejectWithValue }) => {
    try {
      await listingsApi.deleteListing(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка видалення лістингу');
    }
  }
);

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ListingFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Скидаємо сторінку при зміні фільтрів
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearCurrentListing: (state) => {
      state.currentListing = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch listings
      .addCase(fetchListings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.listings;
        state.pagination = {
          page: action.payload.meta.page,
          limit: action.payload.meta.limit,
          total: action.payload.meta.total,
          totalPages: action.payload.meta.pages,
        };
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch listing by id
      .addCase(fetchListingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create listing
      .addCase(createListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update listing
      .addCase(updateListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        if (state.currentListing?.id === action.payload.id) {
          state.currentListing = action.payload;
        }
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete listing
      .addCase(deleteListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.currentListing?.id === action.payload) {
          state.currentListing = null;
        }
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters, setPage, clearCurrentListing, clearError } = listingsSlice.actions;

export default listingsSlice.reducer;

// src/store/slices/categoriesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { categoriesApi } from '@/api/categoriesApi';
import { Category, CategoryTree } from '@/types/category.types';

interface CategoriesState {
  items: Category[];
  categoryTree: CategoryTree[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  categoryTree: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

// Асинхронні дії для категорій
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params: { active?: boolean; parentId?: number | null } = {}, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.getCategories(params);
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання категорій');
    }
  }
);

export const fetchCategoryTree = createAsyncThunk(
  'categories/fetchCategoryTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.getCategoryTree();
      return response.data.categoryTree;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання дерева категорій');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.getCategoryById(id);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання категорії');
    }
  }
);

export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchCategoryBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.getCategoryBySlug(slug);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання категорії');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch category tree
      .addCase(fetchCategoryTree.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryTree = action.payload;
      })
      .addCase(fetchCategoryTree.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch category by id
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch category by slug
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentCategory, clearError } = categoriesSlice.actions;

export default categoriesSlice.reducer;