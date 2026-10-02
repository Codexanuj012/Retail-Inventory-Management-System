# RIMS Database Documentation

## Setup Instructions

To initialize the MySQL database on Windows CMD / PowerShell, execute:

```cmd
mysql -u root -p < database\schema.sql
mysql -u root -p < database\indexes.sql
mysql -u root -p < database\seed.sql