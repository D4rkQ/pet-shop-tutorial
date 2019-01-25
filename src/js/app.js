App = {
  web3Provider: null,
  contracts: {},
    x: null,

  init: function() {
    // Load pets.
      //Daten des Kran aus der Blocckchain auslesen???????????? drizzle!!!!!
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });
    return App.initWeb3();
  },

  initWeb3: function() {
// Is there an injected web3 instance?
      if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
      } else {
          // If no injected web3 instance is detected, fall back to Ganache
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);

    return App.initContract();

  },

  initContract: function() {
      $.getJSON('Adoption.json', function(data) {
          // Get the necessary contract artifact file and instantiate it with truffle-contract
          var AdoptionArtifact = data;
          App.contracts.Adoption = TruffleContract(AdoptionArtifact);

          // Set the provider for our contract
          App.contracts.Adoption.setProvider(App.web3Provider);

          $.getJSON('/kran.json', function(data) {
              var KranArtifact = data;
              //console.log(KranArtifact);

              App.contracts.Kran = TruffleContract(KranArtifact);
              console.log(App.contracts);
              console.log(App.contracts.Kran.deployed());
              App.contracts.Kran.setProvider(App.web3Provider);

              // Use our contract to retrieve and mark the adopted pets
              App.markAdopted();
              App.bindEvents();
          });
      });
  },



  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    //Variable aus Formular einlesen
    $('#submit').on('click', App.createKran);
    $('#initKran').on('click', App.initKrane);
  },

  markAdopted: function(adopters, account) {
      var adoptionInstance;

      App.contracts.Adoption.deployed().then(function(instance) {
          adoptionInstance = instance;

          return adoptionInstance.getAdopters.call();
      }).then(function(adopters) {
          console.log(adopters);

          // adopters.forEach(function(adopter, kran){
          //     if (adopter !== '0x0000000000000000000000000000000000000000') {
          //         $('.panel-pet').eq(kran).find('button').text('Success').attr('disabled', true);
          //     }
          // });


          for (i = 0; i < adopters.length; i++) {
              if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                  $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
              }
          }
      }).catch(function(err) {
          console.log(err.message);
      });

      return App.initKrane();
  },

    initKrane: function () {

        App.contracts.Adoption.deployed().then(function (instance) {
            adoptionInstance = instance;

            return adoptionInstance.getKrane.call();
        }).then(function (krane) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');

            $(petsRow.empty());
            krane.forEach(function (kran, i) {
                App.contracts.Kran.at(kran).then(function (kranInstance) {

                    kranInstance.getName().then(function (kranName) {

                        $.getJSON('../pets.json', function (data) {
                            petTemplate.find('.panel-title').text(kranName);
                            petTemplate.find('img').attr('src', "images/high-top-crane.jpg");
                            petTemplate.find('.pet-breed').text("data[i].breed");
                            petTemplate.find('.pet-age').text("data[i].age");
                            petTemplate.find('.pet-location').text("data[i].location");
                            //Selbsterstellte Krane werden ab Index 30 eingefügt da 0-15 von den Pets belegt ist.
                            petTemplate.find('.btn-adopt').attr('data-id', 30+i);

                            petsRow.append(petTemplate.html());
                        });
                    });
                });
            });
        });

    },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt(event.target).data('id');
console.log(petId);
      var adoptionInstance;

      web3.eth.getAccounts(function(error, accounts) {
          if (error) {
              console.log(error);
          }
          var account = accounts[0];

          App.contracts.Adoption.deployed().then(function(instance) {
              adoptionInstance = instance;

              // Execute adopt as a transaction by sending account
              return adoptionInstance.adopt(petId, {from: account});
          }).then(function(result) {
              console.log(result.toString());
              return App.markAdopted();
          }).catch(function(err) {
              console.log(err.message);
          });
      });
  },

    createKran: function (event) {
        var account;

        //Daten aus dem Frontend abholen
        var kranName = $("#kranName").val();
        var norm = $("#Norm").val();
        alert("Kran Name: " + kranName + "    Norm: " + norm);
        //ausführenden account für Create definieren
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            account = accounts[0];

            //Kran erstellen
            App.contracts.Adoption.deployed().then(function(adoptionInstance) {
                console.log("First: " + "dfas");
                return adoptionInstance.createKran(kranName, {from: account})
            }).then(function(res){
                console.log(res);
                console.log("Second: " + "dfas");
               return App.initKrane();
            });

        });



    },

    //Krandaten werden aus der Blockchain in Frontend gelesen
   initKran: function () {

       App.contracts.Adoption.deployed().then(function(instance) {
           adoptionInstance = instance;

           return adoptionInstance.getKrane.call();
       }).then(function(krane) {
           //console.log(krane);
           console.log(krane[0]);
           return krane[0];
       }).then(function(address) {
           console.log(App.contracts.Kran.at(address));
           //Es ist nicht klar ob folgender Aufruf einen neuen Contract erstellt oder den der angegebenen Adresse aufruft
           App.contracts.Kran.at(address).then(function(kranInstance) {
               var kranName = "asdfds";
               async function getKranName() {
                   console.log(await kranInstance.getName());
               }

               async function initKranName() {
                   const name = (await kranInstance.getName());
                   $('.panel-title').eq(0).text(name);
               }

               getKranName();
               initKranName();


                kranInstance.getName().then(function(data) {
                   console.log(data);
                   App.x = data;
                });

               console.log(kranInstance);

               console.log(kranName);

               console.log("TEST")
             })


           // Kran getName mit Await
           // let kranInstance;
           // async function getKranInstance() {
           //     kranInstance = await App.contracts.Kran.at(address);
           //     console.log(kranInstance);
           //     return kranInstance;
           // }
           //
           // let kranName;
           // async function getKranName() {
           //     instance1 = await getKranInstance();
           //     kranName = await instance1.getName();
           //     console.log(kranName);
           //     return kranName
           // }
           //
           // getKranName().then(function(data) {
           //     console.log(data);
           // });
           // console.log("dfasdfdsafds" + kranName);
           // Kran getName mit Await



       });

   }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});