const { OpenAI } = require('openai');

const configuration = {apiKey: OPENAI_API_KEY};

const openai = new OpenAI(configuration);


async function AI_CALL(amount, term, risk, tags) {
  try {

    let str = "$" + amount + "," + term + ", " + risk + ", ";

    
    if (tags.length != 0) {
      //str += ". I want to invest in things related to: ";
      tags.forEach( (element) => str += element + ", "); 

    }
    

    console.log(str);

    /*//{role: 'system', content: 'For real Estate, make sure they are not investing in properties with a low budget. Also, give a specific address or City or fund to invest in, rather than a general suggestion'},
        {role: 'system', content: 'for each real estate entry, format the json as {"location": [location or address], "amount": [amount in dollars]}'},
    */

    const completion = await openai.chat.completions.create({
      messages: [{role: 'system', content: 'You are a helpful assistant that will assist the user to find smart investments based on their current investment fund. Based on the user input, you may give either stocks or crypto. Answer only as a list of investments and amounts that they should put into each option.' },
                  {role: 'system', content: 'The user will input in the style [amount], [term], [risk], [tags]. The [amount] is the amount in dollars they want to invest, use ALL the money to build the portfolio (if they input $9000, make sure the final portfolio == $9000). The [term] is how long they want their investment to stay in the market. The [risk] is how risky they want their investments to be (higher risk also means greater growth possibilities). The [tags] will be a comma-sepparated list of additional information about the type of investments they want to make.'},
                  {role: 'system', content: 'In the case of stocks and crypto, only give ticker and amount in a JSON format.'},
                  {role: 'system', content: 'name the JSON sections as follows (case sensitive) "stocks", "crypto"'},
                  {role: 'system', content: 'for each ticker (crypto or stocks entry), format the json as {"ticker": [tickerName], "amount": [amount in dollars]}'},
                  {role: 'system', content: 'do not include any characters outside of the JSON formated data'},
                  {role: 'system', content: 'if you cannot find any results, send a default set of stocks back (results that disregard tag) and add "(default option)" to the ticker name'},
                  {role: 'system', content: 'always double check that the amounts (total between crypto and stocks) in the options add up to a total of the amount inputted by the user. If it does not add the default options'},
                  { role: 'user', content: str },
      ],
      model: 'gpt-3.5-turbo',
    });

    console.log(completion.choices[0].message.content);

    let investments = JSON.parse(completion.choices[0].message.content);

    let ret_list = [0,0,0]

    if (investments.hasOwnProperty("stocks")) {
      var stocks = investments.stocks;
      ret_list[0] = stocks;
      console.log("stocks: " + stocks);
    }

    if (investments.hasOwnProperty("crypto")) {
      var crypto = investments.crypto;
      ret_list[1] = crypto;
      console.log("crypto: " + crypto);
    }
    if (investments.hasOwnProperty("RE")) {
      var realEstate = investments.RE;
      ret_list[2] = realEstate
      console.log("real estate: " + realEstate);
    }

    
    
    
    console.log(ret_list);
    return(ret_list);

  } catch (error) {
    console.error('Error with OpenAI API:', error);
  }
}

module.exports = AI_CALL;
