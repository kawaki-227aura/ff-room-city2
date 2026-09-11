const TTL = 24*60*60*1000;
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json;charset=UTF-8","cache-control":"no-store"}})}
function cors(r){r.headers.set("access-control-allow-origin","*");r.headers.set("access-control-allow-methods","GET,POST,DELETE,OPTIONS");r.headers.set("access-control-allow-headers","Content-Type,Authorization");return r}
function auth(c){return c.request.headers.get("authorization")==="Bearer "+c.env.ADMIN_CODE}
export async function onRequest(c){
 const u=new URL(c.request.url), p=u.pathname, m=c.request.method, db=c.env.DB;
 if(m==="OPTIONS") return cors(new Response(null,{status:204}));
 if(!db) return cors(json({error:"D1 non configurée"},500));
 await db.prepare("CREATE TABLE IF NOT EXISTS rooms (id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,reward TEXT,phone TEXT,squad_id TEXT,creator TEXT,created_at TEXT,match_time TEXT,rules TEXT,expires_at TEXT)").run();
 await db.prepare("DELETE FROM rooms WHERE expires_at <= ?").bind(new Date().toISOString()).run();
 try{
  if(p==="/api/rooms" && m==="GET"){let r=await db.prepare("SELECT * FROM rooms ORDER BY id DESC LIMIT 200").all();return cors(json(r.results))}
  if(p==="/api/rooms" && m==="POST"){let b=await c.request.json();for(const k of ["type","reward","phone","squad_id","creator"])if(!b[k])return cors(json({error:"Champ manquant: "+k},400));let now=new Date(),ex=new Date(now.getTime()+TTL);let r=await db.prepare("INSERT INTO rooms(type,reward,phone,squad_id,creator,created_at,match_time,rules,expires_at) VALUES(?,?,?,?,?,?,?,?,?)").bind(b.type,b.reward,b.phone,b.squad_id,b.creator,now.toISOString(),b.match_time||"",b.rules||"",ex.toISOString()).run();return cors(json({ok:true,id:r.meta.last_row_id,expires_at:ex.toISOString()},201))}
  if(p==="/api/admin/login" && m==="POST"){let b=await c.request.json();if(!c.env.ADMIN_CODE||b.code!==c.env.ADMIN_CODE)return cors(json({error:"Code incorrect"},401));return cors(json({token:c.env.ADMIN_CODE}))}
  if(p==="/api/admin/rooms" && m==="GET"){if(!auth(c))return cors(json({error:"Unauthorized"},401));let r=await db.prepare("SELECT * FROM rooms ORDER BY id DESC").all();return cors(json(r.results))}
  if(p.startsWith("/api/admin/rooms/") && m==="DELETE"){if(!auth(c))return cors(json({error:"Unauthorized"},401));let id=Number(p.split("/").pop());await db.prepare("DELETE FROM rooms WHERE id=?").bind(id).run();return cors(json({ok:true}))}
  if(p==="/api/admin/rooms/delete-many" && m==="POST"){if(!auth(c))return cors(json({error:"Unauthorized"},401));let b=await c.request.json();let ids=(b.ids||[]).map(Number).filter(Boolean).slice(0,100);for(const id of ids)await db.prepare("DELETE FROM rooms WHERE id=?").bind(id).run();return cors(json({ok:true,deleted:ids.length}))}
  return cors(json({error:"Not found"},404))
 }catch(e){return cors(json({error:e.message},500))}
}