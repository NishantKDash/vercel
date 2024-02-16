const MAX_LEN = 5;

export default function generate(): string {
    const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
    const length = MAX_LEN;
    var id = "";
    for(let i = 0;i<=length;i++)
    id += subset[Math.floor(Math.random() * subset.length)]
    return id;
  }