App = {
  web3Provider: null,
  contracts: {},
    x: null,

  init: function() {
    // Load pets.
      //Daten des Crane aus der Blocckchain auslesen???????????? drizzle!!!!!

    // $.getJSON('../pets.json', function(data) {
    //   var petsRow = $('#petsRow');
    //   var petTemplate = $('#petTemplate');
    //
    //   for (i = 0; i < data.length; i ++) {
    //     petTemplate.find('.panel-title').text(data[i].name);
    //     petTemplate.find('img').attr('src', data[i].picture);
    //     petTemplate.find('.pet-breed').text(data[i].breed);
    //     petTemplate.find('.pet-age').text(data[i].age);
    //     petTemplate.find('.pet-location').text(data[i].location);
    //     petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
    //
    //     petsRow.append(petTemplate.html());
    //   }
    // });

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

      //ajax should be sync
      $.ajaxSetup({
          async: false
      });

    return App.initContract();

  },

  initContract: function() {
      $.getJSON('CraneBuilder.json', function(data) {
          // Get the necessary contract artifact file and instantiate it with truffle-contract
          var CraneBuilderArtifact = data;
          App.contracts.CraneBuilder = TruffleContract(CraneBuilderArtifact);

          // Set the provider for our contract
          App.contracts.CraneBuilder.setProvider(App.web3Provider);

          $.getJSON('/kran.json', function(data) {
              var KranArtifact = data;
              //console.log(KranArtifact);

              App.contracts.Crane = TruffleContract(KranArtifact);
              console.log(App.contracts);
              console.log(App.contracts.Crane.deployed());
              App.contracts.Crane.setProvider(App.web3Provider);

              // Use our contract to retrieve and mark the adopted pets
              App.initCranes();
              App.bindEvents();
          });
      });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    //Variable aus Formular einlesen
    $('#submit').on('click', App.createCrane);
    $('#initKran').on('click', App.initCranes);
  },

  markRented: function(adopters, account) {
      var adoptionInstance;

      App.contracts.CraneBuilder.deployed().then(function(instance) {
          adoptionInstance = instance;

          return CraneBuilderInstance.getAdopters.call();
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

      //return App.initCranes();
  },

    initCranes: function () {
        App.contracts.CraneBuilder.deployed().then(function (instance) {
            CraneBuilderInstance = instance;
            return CraneBuilderInstance.getCranes.call();
        }).then(function (cranes) {
            var cranesRow = $('#cranesRow');
            var craneTemplate = $('#craneTemplate');

            //delete cranes before rebuilding them
            $(cranesRow.empty());

            //building cranes HTML
            cranes.forEach(function (crane, i) {
                App.contracts.Crane.at(crane).then(function (CraneInstance) {
                    return CraneInstance.getName();
                }).then(function (craneName) {
                    craneTemplate.find('.panel-title').text(craneName);
                    craneTemplate.find('img').attr('src', "images/high-top-crane.jpg");
                    //All rent buttons get an ID to toggle success if they got rented
                    craneTemplate.find('.btn-adopt').attr('data-id', i);
                    cranesRow.append(craneTemplate.html());
                });
                //If the last crane was generated then mark all rented
                if (cranes.length === i + 1) {
                    App.markRented();
                }
            });
        });
    },

  handleAdopt: function(event) {
    event.preventDefault();

      var petId = parseInt($(event.target).data('id'));
console.log(petId);
      var adoptionInstance;

      web3.eth.getAccounts(function(error, accounts) {
          if (error) {
              console.log(error);
          }
          var account = accounts[0];

          App.contracts.CraneBuilder.deployed().then(function(instance) {
              adoptionInstance = instance;

              // Execute adopt as a transaction by sending account
              return CraneBuilderInstance.adopt(petId, {from: account});
          }).then(function(result) {
              console.log(result.toString());
              return App.markRented();
          }).catch(function(err) {
              console.log(err.message);
          });
      });
  },

    createCrane: function (event) {
        var account;

        // Collect data from html-form
        var craneName = $("#cranName").val();
        //...

        /* Accesing the Ethereum-Blockchain-Node to get the Ethereum-
        Account of the crane owner */
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            account = accounts[0];

            /* Accesing the Ethereum-Blockchain-Node to get an instance
            of the CraneBuilder.sol Smart Contract*/
            // Execution of the Smart Contract method "createCrane()"
            App.contracts.CraneBuilder.deployed()
                .then(function (craneBuilderInstance) {
                    return craneBuilderInstance.createCrane(craneName, {from: account})
                }).then(function () {
                // After the crane is created the website get rebuilded.
                return App.initCranes();
            });
        });
    },

    //Krandaten werden aus der Blockchain in Frontend gelesen
   initKran: function () {

       App.contracts.CraneBuilder.deployed().then(function(instance) {
           CraneBuilderInstance = instance;

           return CraneBuilderInstance.getKrane.call();
       }).then(function(krane) {
           //console.log(krane);
           console.log(krane[0]);
           return krane[0];
       }).then(function(address) {
           console.log(App.contracts.Crane.at(address));
           //Es ist nicht klar ob folgender Aufruf einen neuen Contract erstellt oder den der angegebenen Adresse aufruft
           App.contracts.Crane.at(address).then(function(kranInstance) {
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


           // Crane getName mit Await
           // let kranInstance;
           // async function getKranInstance() {
           //     kranInstance = await App.contracts.Crane.at(address);
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
           // Crane getName mit Await



       });

   }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});