export const validateTaiwanId = (id: string) => {
  const regex = /^[A-Z][12]\d{8}$/;
  if (!regex.test(id)) {
    return { error: "身分證號碼格式不正確" };
  }

  const mapping = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    I: 34,
    J: 18,
    K: 19,
    L: 20,
    M: 21,
    N: 22,
    O: 35,
    P: 23,
    Q: 24,
    R: 25,
    S: 26,
    T: 27,
    U: 28,
    V: 29,
    W: 32,
    X: 30,
    Y: 31,
    Z: 33,
  };

  const firstChar = id.charAt(0).toUpperCase();
  const numArr = [
    Math.floor(mapping[firstChar as keyof typeof mapping] / 10),
    mapping[firstChar as keyof typeof mapping] % 10,
  ].concat(id.substring(1).split("").map(Number));

  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
  let sum = 0;
  for (let i = 0; i < numArr.length; i++) {
    sum += numArr[i] * weights[i];
  }

  if (sum % 10 !== 0) {
    return { error: "身分證號碼格式不正確" };
  }

  return { error: null };
};
