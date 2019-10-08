
        var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
        var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        var deck = new Array();
        var players = new Array();
        var currentPlayer = 0;


        function createDeck()
        {
            deck = new Array();
            for (var i = 0 ; i < values.length; i++)
            {
                for(var x = 0; x < suits.length; x++)
                {
                    var weight = parseInt(values[i]);
                    if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                        weight = 10;
                    if (values[i] == "A")
                        weight = 11;
                    var card = { Value: values[i], Suit: suits[x], Weight: weight };
                    deck.push(card);
                }
            }
        }

        

        function createPlayers(num)
        {
            players = new Array();
            for(var i = 1; i <= num; i++)
            {
                var hand = new Array();
                var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
                players.push(player);
            }
        }

        function createPlayersUI() {

            $("#players").html("");
            for(let i = 0; i < players.length; i++){
        
              var div_player = $.parseHTML("<div></div>");
              var div_playerid = $.parseHTML("<div></div>");
              var div_hand = $.parseHTML("<div></div>");
              var div_points = $.parseHTML("<div></div>");
        
              $(div_points).attr({
                "class" : "points",
                "id" : "points_" + i
              });
              $(div_player).attr({
                "class" : "player",
                "id" : "player_" + i
              });
              $(div_hand).attr("id", "hand_" + i);
        
              $(div_playerid).html("Player " + players[i].ID);
              $(div_player).append(div_playerid);
              $(div_player).append(div_hand);
              $(div_player).append(div_points);
              $("#players").append(div_player);
            }
        }

        function shuffle()
        {
            // for 500 turns
            // switch the values of two random cards
            for (var i = 0; i < 500; i++)
            {
                var location1 = Math.floor((Math.random() * deck.length));
                var location2 = Math.floor((Math.random() * deck.length));
                var tmp = deck[location1];

                deck[location1] = deck[location2];
                deck[location2] = tmp;
            }
        }

        function startblackjack()
        {
           $("#btnStart").attr("value", "Restart");
           $("#status").css("display","none");
            // deal 2 cards to every player object
            currentPlayer = 0;
            createDeck();
            shuffle();
            createPlayers(2);
            createPlayersUI();
            dealHands();
            $("#player_" + currentPlayer).addClass("active");
        }

        function dealHands()
        {
            // alternate handing cards to each player
            // 2 cards each
            for(var i = 0; i < 2; i++)
            {
                for (var x = 0; x < players.length; x++)
                {
                    var card = deck.pop();
                    players[x].Hand.push(card);
                    renderCard(card, x);
                    updatePoints();
                }
            }

            updateDeck();
        }

        function renderCard(card, player)
        {
            var hand = $("#hand_" + player);
            $(hand).append(getCardUI(card));
        }

        // function getCardUI(card)
        {
           
            var el = $.parseHTML("<div></div>");
            var icon = '';
            if (card.Suit == 'Hearts')
            icon='&#9825;';
            else if (card.Suit == 'Spades')
            icon = '&spades;';
            else if (card.Suit == 'Diamonds')
            icon = '&#9826';
            else
            icon = '&clubs;';
            
            $(el).attr("class", "card");
            $(el).html(card.Value + "<br/>" + icon);
            return el;
        }

        // returns the number of points that a player has in hand
        function getPoints(player)
        {   
            var ace = 0;
            var score = 0;
            var points = 0;
            for (let x = 0; x < players[player].Hand.length; x++){
                
                
               if (players[player].Hand[x].Weight === 11){
                ace += 1;
                score += 11;
               }
               else score += players[player].Hand[x].Weight;
            }
            

            for(var i = 0; i < players[player].Hand.length; i++)
            {
               points += players[player].Hand[i].Weight;
            }
            if (score > 21 && ace === 1){
                points -= 10;
            }
            else if (score > 21 && ace === 2){ 
                points -= 20;}
            else if (score > 21 && ace === 3){ 
                points -= 30;}    
            
            players[player].Points = points;
            
            return points;
        }

       
        function updatePoints()
        {
            for (var i = 0 ; i < players.length; i++)
            {
                getPoints(i);
                $("#points_" + i).html(players[i].Points);
            }
        }

        function hitMe()
        {
            // pop a card from the deck to the current player
            // check if current player new points are over 21
            var card = deck.pop();
            players[currentPlayer].Hand.push(card);
            renderCard(card, currentPlayer);
            updatePoints();
            updateDeck();
            check();
            
        }

        function stay()
        {
            // move on to next player, if any
            if (currentPlayer != players.length-1) {
                $("#player_" + currentPlayer).removeClass("active");
                currentPlayer += 1;
                $("#player_" + currentPlayer).addClass("active");
                dealer();
                
                
            }
            
            else {
                end();
            }
        }

        function end()
        {
            var winner = -1;
            var score = 0;

            for(var i = 0; i < players.length; i++)
            {   

               if (players[0].Points === players[1].Points){
                    winner = 1;
                }

                else if (players[i].Points > score && players[i].Points < 22)
                {
                    winner = i;
                }

                score = players[i].Points;
            }
           
            $("#status").slideDown(1000);
            $("#status").html("Winner: Player " + players[winner].ID);
            $("#status").delay(2000);
            $("#status").slideUp(1000);
            $("#status").css("display","inline-block");
           
           
        }

        function check()
        {
            if (players[currentPlayer].Points > 21)
            {
                $("#status").slideDown(1000);
                $("#status").html("Player " + players[currentPlayer].ID + " LOST");
                $("#status").css("display","inline-block");
                end();
            }
        }

        function updateDeck()
        {
            $("#deckcount").html(deck.length);
        }

        $( window ).on( "load", function(){
            buildDeck();
            shuffle();
            createPlayers(1);
          });

        function dealer(){

            if (players[currentPlayer]["ID"] == players.length){
               
                while (players[currentPlayer].Points < 21 && players[currentPlayer].Points < players[currentPlayer -1 ].Points ){
                  hitMe();
                }
                if(players[currentPlayer].Points >= players[currentPlayer -1 ].Points && players[currentPlayer].Points < 22) 
                {stay();};


            }
            

          }
          