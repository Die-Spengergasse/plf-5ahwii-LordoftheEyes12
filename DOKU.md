# Dokumentation von Ben Daschner

## Ich habe an John´s Bar gearbeitet

&#x1F942;

## Seed.js

Ich habe seed.js hinzugefügt. mit seed.js werden 20 zufällige Getränke, 10 Benutzer und 5 Bestellungen generiert.

## Server.js

Die Import Syntax war für alle Module defekt und musste korrigiert werden. Der Cookie hat einen Namen bekommen "sessionCookieSponsoredByDAS22272" es wurde auch eine Authentication Middelware implementiert um die Getränkekarte nur für angemeldete Benutzer zu zeigen

```js
const requireAuthentication = (req, res, next) => {
    console.log(req.session.user);
    if (!req.session.user) return res.status(401).send("Unauthorized");
    next();
  };
```

Diese middleware wird wie folgt verwendet:

```js
app.get("/menu", requireAuthentication, async function (req, res) {
    const drinks = await prisma.drink.findMany();
    res.json(drinks);
});
```

Wenn kein benutzer angemeldet ist wird hier nichts angezeigt (HTTP 401 Unauthorized)

Weiters wurde ein Fehler beim ausgeben von Bestellungen korrigiert womit das auch möglich ist

Ich habe auch eine Logout funktion hinzugefügt, womit die Session zerstört wird und der Cookie beim client gelöscht wird

```js
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).send("Error logging out");
      }
   
      res.clearCookie("sessionCookieSponsoredByDAS22272.sid");
      res.send("Logout successful");
    });
  });
```

## endpoints.rest

hier wurden drei Endpoints zum Testen hinzugefügt.

## index.html / style.css

Zur Loginseite wurde ein modernes Syling hinzugefügt

## Sonstiges

Der Folder des Projekts wurde bereinigt (da kein Deno verwendet wird wurden alle Deno Referenzen gelöscht). Faker wurde hinzugefügt für das seeden. Ebenfalls wurde in dem package.json das seed script hinzugefügt. Auch eine Gitignore Datei wurde eingebaut
