
import React from 'react';
import AccordionItem from './AccordionItem.tsx';

const InformationGuide: React.FC = () => {
    return (
        <AccordionItem title="Fontos Tudnivalók a Pályázatról" isOpenDefault={true}>
            <div className="prose prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p className="lead">
                    Kedves Hallgatók! Az alábbiakban összefoglaltuk a Szociális Támogatások igénylésével kapcsolatos legfontosabb információkat. Kérjük, a pályázat leadása előtt figyelmesen olvassák el!
                </p>

                <h3 id="tamogatasok-tipusai">Támogatások Típusai és Igénylésük</h3>
                <p>A szociális támogatási kérelmeket (501, 502, 503) kizárólag a Neptun rendszeren keresztül lehet benyújtani az <code>Ügyintézés / Kérvények</code> menüpontban.</p>
                
                <h4>501 - Rendszeres Szociális Támogatás</h4>
                <p>A nehezebb anyagi körülmények között élő hallgatókat támogatja félévente. Az elbírálás a pontrendszer alapján történik, melyet ez a kalkulátor is használ.</p>
                
                <h4>502 - Alaptámogatás</h4>
                <p>Elsőéves, államilag támogatott képzésre beiratkozott hallgatók igényelhetik az első félévükben, amennyiben a következő kategóriák valamelyikébe tartoznak: hátrányos helyzetű, halmozottan hátrányos helyzetű, családfenntartó, nagycsaládos, árva, félárva, gyámsága megszűnt, vagy fogyatékkal élő/rászorult.</p>
                
                <h4>503 - Rendkívüli Szociális Támogatás</h4>
                <p>Annak a hallgatónak szól, akinek szociális helyzete félév közben, egy hirtelen, váratlan esemény (pl. haláleset, baleset, munkahely elvesztése) miatt jelentősen megváltozott, és emiatt rendszeres szociális ösztöndíjra is jogosult lett volna.</p>

                <h3 id="adat-egyeztetes">Adategyeztetés és Dokumentumok</h3>
                <p>
                    A támogatások igénylésének alapfeltétele, hogy a Neptunban szereplő személyes és esélyegyenlőségi adatok naprakészek legyenek.
                </p>
                <ul>
                    <li><strong>Adatok ellenőrzése:</strong> Minden félévben ellenőrizd az adataidat a <code>Saját adatok / Személyes adatok</code> menüpont alatt. Az esélyegyenlőségi adatok az <code>Előnyben részesítés</code> fülön találhatóak.</li>
                    <li><strong>Adatok módosítása:</strong> Hiányzó adatokat az <code>Információ / Általános nyomtaványok / Esélyegyenlőségi adatbejelentő</code> űrlap és a szükséges igazolásokkal lehet a Tanulmányi Osztályon rögzíteni.</li>
                    <li><strong>Dokumentumok csatolása:</strong> Az igazolásokat PDF, PNG, JPG, vagy JPEG formátumban, egyenként legfeljebb 10 MB méretben kell feltölteni a kérvény megfelelő pontjaihoz.</li>
                </ul>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-4 my-6 rounded-md">
                    <p className="font-bold text-blue-800 dark:text-blue-300">Kiemelten Fontos Dokumentumok és Tudnivalók</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>Hatósági bizonyítvány az egy háztartásban élőkről:</strong> A kérvény leadásától számítva <strong>egy hónapnál nem régebbi</strong> igazolás szükséges.</li>
                        <li><strong>Jövedelemigazolások:</strong> Csak a megfelelő időszakra vonatkozó igazolásokat fogadják el!
                            <ul className="list-circle pl-5 mt-1">
                                <li><strong>Őszi félév esetén:</strong> június, július, augusztus havi nettó jövedelem.</li>
                                <li><strong>Tavaszi félév esetén:</strong> november, december, január havi nettó jövedelem.</li>
                            </ul>
                            A munkáltatói igazolásnak tartalmaznia kell az aláírást és a pecsétet is!
                        </li>
                         <li><strong>Tanúzás:</strong> Bizonyos dokumentumok (pl. albérleti szerződés, szívességi lakáshasználati szerződés, nyilatkozatok) érvényességéhez két tanú szükséges. A tanú nem lehet érintett a dokumentumban. A tanúzáskor a nyomtatott név, személyi igazolványszám vagy lakcím, és az aláírás megadása kötelező.</li>
                    </ul>
                </div>

                <h3 id="palyazat-menete">A Pályázat Leadása és Javítása</h3>
                <p>A kitöltött kérvényt a 'Kérvény beadása' gombbal lehet véglegesíteni. Ekkor a kérvény 'Ügyintézés alatt' státuszba kerül. A nem megfelelő vagy hiányos igazolások a kérvény elutasítását vonják maguk után!</p>
                <ul>
                    <li><strong>Javítás:</strong> Amennyiben a kérvény hiánypótlásra vagy javításra szorul, a bírálók visszaküldik azt. Erről Neptun üzenetben kapsz értesítést. A javításra korlátozott idő áll rendelkezésre.</li>
                     <li><strong>Önellátó hallgatók:</strong> Az önellátó státuszt választó hallgatóknak a jövedelemigazolás részeként egy személyes beszélgetésen is részt kell venniük a kari Szociális Bizottsággal. Ennek időpontjáról előzetes értesítést kapnak.</li>
                     <li><strong>Profi tipp:</strong> Amennyiben valamelyik dokumentumod még hiányzik a leadáskor, tölts fel egy üres lapot a helyére. Így be tudod nyújtani a kérvényt, és a hiányzó dokumentumot a javítási időszakban pótolhatod.</li>
                </ul>
                
                <h3 id="tovabbi-kerdesek">További Kérdések?</h3>
                <p>Ha kérdésed merül fel, keresd a karodhoz tartozó Hallgatói Önkormányzat szociális bizottságát vagy a Diákjóléti Bizottságot.</p>
            </div>
        </AccordionItem>
    );
};

export default InformationGuide;