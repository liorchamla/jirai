import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { Message } from "primereact/message";
import type { Epic } from "../../types/Epic";
import { getApi } from "../../utils/api";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { WretchError } from "wretch";
import type { Ticket } from "../../types/Ticket";
import type { Comment } from "../../types/Comment";

interface PropsType {
  epic?: Epic;
  ticket?: Ticket;
  comment?: Comment;
  onSubmit: () => void;
}

function CommentForm({ epic, ticket, comment, onSubmit }: PropsType) {
  const [content, setContent] = useState<string>(comment?.content || "");
  const [errorContent, setErrorContent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Réinitialiser le contenu quand l'epic change
  useEffect(() => {
    setContent(comment?.content || "");
    setErrorContent([]);
    setError(null);
  }, [epic]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (comment) {
        await updateComment();
      } else {
        await createNewComment();
      }
      onSubmit();
      setContent(""); // Réinitialiser le contenu après soumission
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
      setError(
        "Une erreur s'est produite lors de la création ou la modification du commentaire."
      );
    }
  };

  const createNewComment = async () => {
    try {
      await getApi()
        .url("/comments")
        .post({
          content,
          epicId: epic?.id,
          ticketId: ticket?.id,
        })
        .unauthorized(() => {
          navigate("/login");
        })
        .error(422, (err) => {
          handleApiError(err);
        })
        .json()
        .then((result) => {
          if (result) {
            // Réinitialiser le contenu après succès
            onSubmit();
          }
        });
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
      setError(
        "Une erreur s'est produite lors de la création ou la modification du commentaire."
      );
    }
  };

  const updateComment = async () => {
    try {
      await getApi()
        .url(`/comments/${comment?.id}`)
        .patch({
          content,
        })
        .unauthorized(() => {
          navigate("/login");
        })
        .error(422, (err) => {
          handleApiError(err);
        })
        .json()
        .then((result) => {
          if (result) {
            // Réinitialiser le contenu après succès
            onSubmit();
          }
        });
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
      setError(
        "Une erreur s'est produite lors de la création ou la modification du commentaire."
      );
    }
  };

  const handleApiError = (err: WretchError) => {
    err.json.issues.forEach((error: { path: string[] }) => {
      if (error.path[0] === "content") {
        setErrorContent((errorContent) => [
          ...errorContent,
          "Le contenu doit contenir au moins 2 caractères.",
        ]);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Editor
        id="commentaire"
        placeholder="Votre commentaire"
        value={content}
        onTextChange={(e) => setContent(e.htmlValue || "")}
      />
      {errorContent.length > 0 && (
        <Message
          severity="error"
          text={errorContent.join(", ")}
          className="w-full mb-5"
        />
      )}
      {error && (
        <Message severity="error" text={error} className="w-full mb-5" />
      )}
      <div className="self-end">
        <Button
          type="submit"
          label={comment ? "Modifier commentaire" : "Créer commentaire"}
        />
      </div>
    </form>
  );
}

export default CommentForm;
