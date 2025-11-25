function greet(name: string, boo: boolean, num:number): string{
  return `Hello, ${name}. bool: ${boo}. number:${num}`;
}

const message: string = greet("World", true, 12);
console.log(message);
