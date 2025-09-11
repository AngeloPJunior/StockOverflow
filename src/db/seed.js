import { Product, sequelize } from './index.js';

const seeds = [
  { titulo:'Watchmen', autor:'Alan Moore', tipo:'HQ', quantidade:8 },
  { titulo:'O Hobbit', autor:'J.R.R. Tolkien', tipo:'LIVRO', quantidade:5 },
  { titulo:'Sandman Vol. 1', autor:'Neil Gaiman', tipo:'HQ', quantidade:10 },
];

(async () => {
  try {
    await sequelize.authenticate();
    for (const s of seeds) await Product.create(s);
    console.log('✅ Seed inserido');
    process.exit(0);
  } catch(e){ console.error(e); process.exit(1); }
})();
