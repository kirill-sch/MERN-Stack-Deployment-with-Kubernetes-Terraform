db = db.getSiblingDB("admin");

if (!db.getUser("kirill_admin")) {
    db.createUser({
        user: "kirill_admin",
        pwd: "kirill_admin55",
        roles: [
            { role: "root", db: "admin"},
            { role: "readWrite", db: "freestyle"}
        ]
    });
    print("User kirill_admin created successfully");
} else {
    print("User kirill_admin already exists, skipping creation");
}