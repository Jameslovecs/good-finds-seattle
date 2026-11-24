import { getChatGPTUser } from '../../chatgpt-auth';
export async function GET(){const u=await getChatGPTUser();return Response.json({signedIn:!!u},{headers:{'Cache-Control':'no-store'}});}
