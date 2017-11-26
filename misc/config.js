module.exports = {

    'secret': 'Mxmbawlx50XOpKkUMcY2wNjoRmU06g3ComNXJfxfnyt9ESuAKSQxe8FXG',
    'sessionSecret': '2dgiEtWdUxbqK9hZ9sWZ4KdGwI5pRmQo0xivuMlh5G2f0ZBco2eDPEZ269Mg',
    'menuUnsigned': [{label: "Signin", link: '/signin'}],
    'menuSigned': [{label: "Users", link: '/users'}, {label: "Signout", link: '/signout'}],
    'roles': ['super', 'admin', 'cashier'],
    'tariffTypes': [{code:'adult', name:'Adult'},{code:'child',name:'Child'},{code:'other', name:'Other'}],
    'cardStatus': [{code:'published', name: 'Published'},{code:'sold', name: 'Sold'},{code:'activated', name: 'Activated'},{code:'overdue', name: 'Overdue'},{code:'blocked', name: 'Blocked'}],
    'passType': [{code: '0', name: 'Not a pass'},{code: '1', name: '1 Day'},{code: '3', name: '3 Days'},{code: '6', name: '6 Days'}]
};