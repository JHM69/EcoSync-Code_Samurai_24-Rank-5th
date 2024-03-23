Insert 4 default Role in the Role table

```sql
INSERT INTO "Role" (id, type)
VALUES
(1, 'SystemAdmin'),
(2, 'STSManager'),
(3, 'LandfillManager'),
(4, 'Unassigned')
ON CONFLICT (type) DO NOTHING;
```