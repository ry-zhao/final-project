select * from "users"
    where "screenName" = $1
returning *
