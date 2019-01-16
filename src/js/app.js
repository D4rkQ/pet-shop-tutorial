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

      //
      // console.log(web3.version);
      // var myContract = new web3.eth.contract('Adoption.json', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', {
      //     from: '0xFE62CDdA2C8922719cBFd2Bd8c8b9c43103c8152', // default from address
      //     gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
      // });
      //
      // myContract.new("param1", "param2",{data: '0xae0B295669a9FD93d5F28D9Ec35E40f4cb697BAe', from: '0xFE62CDdA2C8922719cBFd2Bd8c8b9c43103c8152', gas: 1000000});

    return App.initContract();
  },

  initContract: function() {
      $.getJSON('Adoption.json', function(data) {
          // Get the necessary contract artifact file and instantiate it with truffle-contract
          var AdoptionArtifact = data;
          App.contracts.Adoption = TruffleContract(AdoptionArtifact);

          // Set the provider for our contract
          App.contracts.Adoption.setProvider(App.web3Provider);

          // Use our contract to retrieve and mark the adopted pets
          return App.markAdopted();
      });

      $.getJSON('/kran.json', function(data) {
          var KranArtifact = data;
          //console.log(KranArtifact);

          App.contracts.Kran = TruffleContract(KranArtifact);
          console.log(App.contracts);
          console.log(App.contracts.Kran.deployed());
          App.contracts.Kran.setProvider(App.web3Provider);

          // App.contracts.Kran.deployed().then(function(instance) {
          //     kranInstance = instance;
          //     console.log("dafsdf");
          // });
      });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    //Variable aus Formular einlesen
    $('#submit').on('click', App.createKran);
    $('#submit').on('click', App.createKran);
  },

  markAdopted: function(adopters, account) {
      var adoptionInstance;

      App.contracts.Adoption.deployed().then(function(instance) {
          adoptionInstance = instance;

          return adoptionInstance.getAdopters.call();
      }).then(function(adopters) {
          for (i = 0; i < adopters.length; i++) {
              if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                  $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
              }
          }
      }).catch(function(err) {
          console.log(err.message);
      });

      //14.01.2019

        App.initKran();

        // ende 14.01.2019
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

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

        async function createKran(adoptionInstance, name) {
            var account;

            //ausführenden account für Create definieren
            web3.eth.getAccounts(function(error, accounts) {
                if (error) {
                    console.log(error);
                }
                account = accounts[0];
            });

            //CreateKran auf Smart Contract ausführen
            return await adoptionInstance.createKran(name, {from: account});
        }

        //Daten aus dem Frontend abholen
        var x = $("#Norm").val();
        var name = $("#zuname").val();
        App.x = x;
        //alert(x + name);
        alert(App.x);

        //Kran erstellen
        App.contracts.Adoption.deployed().then(function(instance) {
            createKran(instance, name);
        });
    },

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
           App.contracts.Kran.at(address).then(function(instance) {
               var kranInstance;
               var kranName = "asdfds";
               kranInstance = instance;
               async function getKranName() {
                   console.log(await instance.getName());
               }
               getKranName();



               console.log(kranInstance.getName().then(function(data) {
                   return data;
               }).then(function(data1) {
                   return data1;
                   }).then(function(data2) {
                       return data2;
                   }).then(function(data3) {
                       return data3;
               })

               );




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
