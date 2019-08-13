const encryptWords = word => {
	
	word = word.split(/\W+/).join("").toLowerCase(); // to Normalize the input //add dom codes here for Normalized txt 
	
	let wordColumnLength = Math.ceil(Math.sqrt(word.length)); //gets the appropriate column length

	let sqrWord = []; // where to store the multidimensional array

	for (let i = 0; i < word.length; i += wordColumnLength) sqrWord.push(word.substr(i, wordColumnLength));
	//helps to produce the Pseudo,2D-Array

	let [firstSqrWord, lastSqrWord] = [sqrWord[0].length, sqrWord[sqrWord.length - 1].length]; 
	// ES6 destrcuturing so as to get the length of the first and last word 

	if (firstSqrWord > lastSqrWord) for (let i = 0; i < (firstSqrWord - lastSqrWord); i++) sqrWord[sqrWord.length - 1] += " ";
	// to pad the last word with spaces if it's shorter than the rest //might add dom codes here

	let [cipherText, cipherArray] = ["", []]; 

	for (let column = 0; column < firstSqrWord; column++) {
		
		for (let row = 0; row < sqrWord.length; row++) cipherText += sqrWord[row][column];
		
		cipherArray.push(cipherText);
		//add dom codes here for each 
		cipherText = "";
	} //to get each block of ciphered words(vertical) 
	
	return cipherArray
};

console.log (encryptWords("If man was meant to stay on the ground, god would have given us roots."))

