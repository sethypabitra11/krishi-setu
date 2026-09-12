import axios from 'axios';

// Defaults to Vite dev proxy (/ml-api) or direct Render URL
const ML_BASE_URL = import.meta.env.VITE_ML_API_URL || 'https://sih-2026-lx6e.onrender.com';

const mlApi = axios.create({
  baseURL: ML_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // accommodate Render cold-starts
});

export const ML_LOCATIONS = [
  'Khandagiri',
  'Old Town',
  'Patia',
  'Rasulgarh',
  'Saheed Nagar',
  'Unit-1 Market',
  'Vani Vihar',
];

export const ML_PRODUCTS = [
  'Brinjal',
  'Cabbage',
  'Cauliflower',
  'Onion',
  'Potato',
  'Spinach',
  'Tomato',
];

/**
 * Predict expected price per kg for a product in a specific market
 */
export const predictPrice = async ({ location, product, market_supply_kg = 500, festival_season = 0 }) => {
  const res = await mlApi.post('/predict-price', {
    location,
    product,
    market_supply_kg: Number(market_supply_kg),
    festival_season: Number(festival_season),
  });
  return res.data;
};

/**
 * Predict expected local demand in kg
 */
export const predictDemand = async ({ location, product, market_supply_kg = 500, festival_season = 0 }) => {
  const res = await mlApi.post('/predict-demand', {
    location,
    product,
    market_supply_kg: Number(market_supply_kg),
    festival_season: Number(festival_season),
  });
  return res.data;
};

/**
 * Get top 3 recommended most profitable crops for a given mandi
 */
export const recommendProducts = async ({ location, festival_season = 0, product_supplies = {} }) => {
  // Ensure default supplies for standard items if not provided
  const supplies = {
    Tomato: 500,
    Potato: 500,
    Onion: 400,
    Brinjal: 300,
    Cabbage: 350,
    Cauliflower: 350,
    Spinach: 200,
    ...product_supplies,
  };

  const res = await mlApi.post('/recommend-products', {
    location,
    festival_season: Number(festival_season),
    product_supplies: supplies,
  });
  return res.data;
};

export default mlApi;
