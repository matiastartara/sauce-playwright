import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';
import { z } from 'zod';


const LocationSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

const CharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(['Alive', 'Dead', 'unknown']),
  species: z.string(),
  type: z.string(),
  gender: z.enum(['Male', 'Female', 'Genderless', 'unknown']),
  origin: LocationSchema,
  location: LocationSchema,
  image: z.string().url(),
  episode: z.array(z.string().url()),
  url: z.string().url(),
  created: z.string(),
});

const createPostBody = JSON.parse(
  readFileSync(resolve(process.cwd(), 'data/api/create-post.json'), 'utf-8'),
);

test('GET - Get character list', async () => {
  const response = await fetch('https://rickandmortyapi.com/api/character');
  const data = await response.json();
  expect(data.results.length).toBeGreaterThan(0);
});

test('GET - Get character profile', async () => {
  const response = await fetch('https://rickandmortyapi.com/api/character/1');
  const data = await response.json();
  expect(data.id).toBe(1);
  expect(data.name).toBe('Rick Sanchez');
  expect(data.gender).toBe('Male');
  expect(data.species).toBe('Human');
  expect(data.origin.name).toBe('Earth (C-137)');
  expect(data.location.name).toBe('Citadel of Ricks');

  //console.log(data);
  expect(() => CharacterSchema.parse(data)).not.toThrow();
});

test('POST - Create new post', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPostBody),
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));

  expect(response.status).toBe(201);
  expect(data.title).toBe(createPostBody.title);
  expect(data.body).toBe(createPostBody.body);
  expect(data.userId).toBe(createPostBody.userId);
  expect(data.id).toBeDefined();
});

test('Mocked GET - Posts list returns fake data', async ({ page }) => {
  // Interceptamos la llamada antes de que llegue al servidor real
  await page.route('https://jsonplaceholder.typicode.com/posts', async (route) => {
    const fakeResponse = [
      {
        userId: 1,
        id: 1,
        title: 'Mocked title',
        body: 'This is a mocked response body for testing purposes.',
      },
      {
        userId: 1,
        id: 2,
        title: 'Second mocked post',
        body: 'Another fake post body.',
      },
    ];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fakeResponse),
    });
  });

  const response = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    return res.json();
  });

  console.log(JSON.stringify(response, null, 2));

  expect(response).toHaveLength(2);
  expect(response[0].title).toBe('Mocked title');
  expect(response[1].id).toBe(2);
});

test('Mocked error - Posts endpoint returns 500', async ({ page }) => {
  await page.route('https://jsonplaceholder.typicode.com/posts', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  const response = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    return { status: res.status, body: await res.json() };
  });

  expect(response.status).toBe(500);
  expect(response.body.error).toBe('Internal Server Error');
});