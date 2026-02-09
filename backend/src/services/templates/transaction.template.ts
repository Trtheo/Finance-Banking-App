export const transactionTemplate = (
  name: string,
  amount: number,
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER"
) => `
  <h3>Hello ${name}</h3>
  <p>A ${type} of <b>$${amount}</b> was made on your account.</p>
  <p>If this wasn’t you, contact support immediately.</p>
  <br/>
  <b>Finance & Banking App</b>
`;
