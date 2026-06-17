import { test, expect } from '@playwright/test';

test('GET - Retorna lista de personajes', async () => {
  const response = await fetch('https://rickandmortyapi.com/api/character');
  const data = await response.json();
  expect(data.results.length).toBeGreaterThan(0);
});