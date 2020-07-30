export const config = {
        // size of the generated hash
        hashBytes: 512,
        // larger salt means hashed passwords are more resistant to rainbow table, but
        // you get diminishing returns pretty fast
        saltBytes: 32,
        // more iterations means an attacker has to take longer to brute force an
        // individual password, so larger is better. however, larger also means longer
        // to hash the password. tune so that hashing the password takes about a
        // second
        iterations: 100000
     
};
