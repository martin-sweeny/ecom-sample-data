/**
 * Make a set of 1500 users, then make a set of 25,000 orders attributed to
 * those 1500 users. The orders are weighed so that most users buy only a few
 * items.
 *
 * @param  {UserFactory} UserFactory  An instance of the UserFactory 'class'
 *                                    to create a set of users and get revelant
 *                                    data about them.
 * @param  {OrderFactory} OrderFactory An instance of the OrderFactory 'class'
 *                                     to create a set of orders attributed to
 *                                     the users created by the UserFactory
 * @param  {CsvWriter} CsvWriter    A helper 'class' to create the csv file with
 *                                  the final info
 *
 * @return {boolean} Will return true on success
 */
(function (UserFactory, OrderFactory, CsvWriter) {
    'use strict';

    var users  = new UserFactory();
    var orders = new OrderFactory();
    var writer = new CsvWriter();

    users.make(1500);

    orders.setUserIdList(users.getIdList());
    orders.make(25000);

    writer.write('orders.csv', orders.getOrders());

    return true;

} (
    function UserFactory () {
        'use strict';

        var self = this;

        var CONFIG = {
            'names' : {
                'first' : [
                    'martin',
                    'nicholas',
                    'josh',
                    'harold',
                    'john',
                    'george',
                    'james',
                    'chris',
                    'howard',
                    'walter',
                    'genie',
                    'susan',
                    'meagan',
                    'jessica',
                    'britney',
                    'molly',
                    'jane',
                    'lita',
                    'katie',
                    'lynn',
                ],
                'last' : [
                    'sweeny',
                    'fried',
                    'aitkins',
                    'hoffmann',
                    'whatever',
                ]
            }
        };

        var users = [];

        var User = function (id, firstName, lastName, email) {
            this.id        = id;
            this.firstName = firstName;
            this.lastName  = lastName;
            this.email     = email;
            return this;
        }

        function randomLetters (len) {
            var chars = 'abcdefghijklnmopqrstuvwxyz';
            var r = '';
            while ( r.length < len ) {
                r+= chars[ Math.ceil(Math.random() * chars.length)];
            }
            return r;
        }

        function makeEmail () {
            var r = '';
            r += randomLetters( Math.round(Math.random() * 12) );
            r += '@'
            r += randomLetters( Math.round(Math.random() * 12) );
            r += '.'
            r += randomLetters( Math.round(Math.random() * 4) );
            return r;
        }

        self.make = function ( count ) {
            var results = [];

            for ( var i = 0; i < count; i++ ) {
                results.push(new User(
                    i + 1,
                    CONFIG.names.first[ Math.ceil(Math.random() * CONFIG.names.first.length) ],
                    CONFIG.names.last[ Math.ceil(Math.random() * CONFIG.names.last.length) ],
                    makeEmail()
                ))
            }
            users = results;
            return true;
        }

        self.getUsers = function () {
            return users;
        }

        self.getIdList = function () {
            var ids = [];
            for ( var i = 0; i < users.length; i++ ) {
                ids.push(users[i].id);
            }
            return ids;
        }

        return self;
    },

    function OrderFactory () {
        'use strict';

        var self = this;

        var userIds = [];
        var orders  = [];

        var Order = function (id, userId, orderQty, subtotal, date) {
            this.id        = id;
            this.userId    = userId;
            this.orderQty  = Math.round(orderQty);
            this.subtotal  = parseFloat(subtotal).toFixed(2);
            this.date      = date;
            this.timestamp = +date;
            return this;
        };

        function randomDate(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }

        self.setUserIdList = function (list) {
            userIds = list;
        };

        self.getOrders = function () {
            return orders;
        }

        self.make = function (count) {
            var results = [];
            var qty;
            var userId;
            var subtotal;
            var date;
            var dateString;

            for ( var i = 0; i < count; i++ ) {
                qty = Math.ceil( Math.random() > 0.5 ? Math.random() * 10 : Math.random() * 10);
                subtotal = qty * (Math.round(Math.random() * 100) + 25);
                userId = userIds[ Math.floor(Math.random() * userIds.length) ];

                date = randomDate(new Date(+new Date() - (1000*60*60*24*365*2)), new Date());

                results.push(new Order (
                    i + 1,
                    userId,
                    qty,
                    subtotal,
                    date
                ));

                if ( userId === undefined ) undefinedCount++;

                if( userIds.length >= 150 && Math.random() > 0.5 ) {
                    userIds.splice(userIds.indexOf(userId), 1);
                }

            }

            orders = results;
            return true;
        };

        return self;

    },

    function CsvWriter () {
        'use strict';

        var self = this;
        var fs = require('fs');

        function writeHeader (item) {
            var result = [];
            for ( var prop in item ) {
                if ( !item.hasOwnProperty(prop) ) continue;
                result.push('"' + prop + '"');
            }
            return result.join(', ');
        }

        function writeRow (item) {
            var result = [];
            for ( var prop in item ) {
                if ( !item.hasOwnProperty(prop) ) continue;
                result.push((typeof item[prop] === 'string' ? '"' + item[prop] + '"' : item[prop]));
            }
            return result.join(', ');
        }

        self.write = function (filename, rows) {
            var output = '';

            output += writeHeader(rows[0]);
            output += ",\n";

            for ( var i = 0, max = rows.length; i < max; i++ ) {
                output += writeRow(rows[i]);
                if ( i !== max ) output+=",\n";
            }

            fs.writeFile(filename, output);
        };

        return self;

    }
));

