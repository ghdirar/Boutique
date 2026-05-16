import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

function getFirestoreErrorMessage(fetchError) {
  if (!fetchError?.code) {
    return "Impossible de charger les produits.";
  }

  if (fetchError.code === "permission-denied") {
    return "Lecture Firestore refusée. Vérifiez les règles de la collection produits.";
  }

  if (fetchError.code === "failed-precondition") {
    return "Firestore demande une configuration complémentaire (index ou base non prête).";
  }

  if (fetchError.code === "unavailable") {
    return "Firestore est indisponible pour le moment.";
  }

  return `Erreur Firebase: ${fetchError.code}`;
}

export default function useProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProduits() {
      try {
        setLoading(true);
        setError("");
        const produitsQuery = query(collection(db, "produits"), orderBy("dateAjout", "desc"));
        const snapshot = await getDocs(produitsQuery);

        if (!active) {
          return;
        }

        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProduits(data);
      } catch (fetchError) {
        console.error("Erreur chargement produits:", fetchError);

        if (active) {
          setError(getFirestoreErrorMessage(fetchError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProduits();

    return () => {
      active = false;
    };
  }, []);

  return { produits, loading, error };
}
