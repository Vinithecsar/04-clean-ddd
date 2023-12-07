import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswersRepository } from "../repositories/answers-repository";
import { Answer } from "../../enterprise/entities/answer";
import { Either, right } from "@/core/either";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  attachmentsIds: string[];
  content: string;
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentsIds.map((attId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answerRepository.create(answer);

    return right({ answer });
  }
}
