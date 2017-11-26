exports.methods = {

    nameById: function(id, arr) {
        var ar = Array(arr);
        var name = '';
        arr.forEach( function (item) {
            if (item.code == id) {
                name = item.name;
            }
        });
        return name;
    }

};


