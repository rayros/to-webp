Convert png,jpg to webp if modification date is different.

`$ npm install -g to-webp`

`$ to-webp --help`

```bash
Usage: to-webp [options]

Convert png,jpg to webp if modification date is different.

Options:
  -p, --pattern '<pattern>'  glob path pattern
  -h, --help                 display help for command
```

*Example:* 

```bash
to-webp -p './src/assets/!(icons)/**/*.{png,jpeg,jpg}'
```

**Use in your own program**

```typescript
import { toWebP } from "to-webp";

toWebP('./src/assets/!(icons)/**/*.{png,jpeg,jpg}')
  .then(() => {
    console.log("Success");
  })
  .catch(error => {
    console.error(error);
  });
```