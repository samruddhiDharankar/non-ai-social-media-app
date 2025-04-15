# for frontend setup

```
npm create vite@latest frontend --template react
cd frontend
npm install
```

# for backend setup

```
mkdir backend && cd backend
npm init -y
npm install express
npm install -D typescript ts-node @types/node @types/express            #for using ESM mode - instead of require to use import statements
npx tsc --init  # created a tsconfig.json
```

added this in tsconfig.json

```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": true
  }
}
```

# for env variable setup

```
npm install dotenv
npm install -D dotenv-cli   # to run diff environments
```

# for mongodb & mongoose setup

```
npm install mongoose
```
