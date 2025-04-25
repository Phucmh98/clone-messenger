import getConversationById from "@/app/actions/getConversationById";
import getMessenges from "@/app/actions/getMessenges";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: Promise<IParams> }) => {
  const conversation = await getConversationById((await params).conversationId);
  const messages = await getMessenges((await params).conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation = {conversation}/>
        {/* @ts-expect-error Server Component */}
        <Body initialMessages ={messages}/>
        <Form/>
        </div>
    </div>
  );
};

export default ConversationId;
