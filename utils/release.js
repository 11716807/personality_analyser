// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production'; // webpack literally cannot accept any other value apart from developement or production.
process.env.ASSET_PATH = '/';
process.env.RELEASE = 'true';

console.log('\n=== Release Build Started ===');
console.log('BABEL_ENV:', process.env.BABEL_ENV);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ASSET_PATH:', process.env.ASSET_PATH);

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');
process.env.RELEASE_STAMP = `r${year}${month}${day}_${hours}${minutes}${seconds}`;

require('./buildprocess');
