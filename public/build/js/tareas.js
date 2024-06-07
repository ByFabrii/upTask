!function(){!async function(){c();try{const t=`/api/tareas?id=${s()}`,a=await fetch(t),o=await a.json();e=o.tareas,n()}catch(e){console.log(e)}finally{d()}}();let e=[],t=[];document.querySelector("#agregar-tarea").addEventListener("click",(function(){o()})),document.addEventListener("keydown",(function(e){e.altKey&&"n"===e.key.toLowerCase()&&(e.preventDefault(),o())})),document.addEventListener("keydown",(function(e){if("Escape"===e.key){const e=document.querySelector(".modal");e&&e.remove()}}));function a(a){const o=a.target.value;t=""!==o?e.filter((e=>e.estado===o)):[],n()}function n(){!function(){const e=document.querySelector("#listado-tareas");for(;e.firstChild;)e.removeChild(e.firstChild)}(),function(){const t=e.filter((e=>"0"===e.estado)),a=document.querySelector("#pendientes");0===t.length?a.disabled=!0:a.disabled=!1}(),function(){const t=e.filter((e=>"1"===e.estado)),a=document.querySelector("#completadas");0===t.length?a.disabled=!0:a.disabled=!1}();const a=t.length?t:e;if(0===a.length){const e=document.querySelector("#listado-tareas"),t=document.createElement("LI");return t.textContent="No Hay Tareas",t.classList.add("no-tareas"),void e.appendChild(t)}const r={0:"Pendiente",1:"Completa"};a.forEach((t=>{const a=document.createElement("LI");a.dataset.tareaId=t.id,a.classList.add("tarea");const l=document.createElement("P");l.textContent=t.nombre;const u=document.createElement("DIV");u.classList.add("opciones");const m=document.createElement("BUTTON");m.classList.add("estado-tarea"),m.classList.add(`${r[t.estado].toLowerCase()}`),m.textContent=r[t.estado],m.dataset.estadoTarea=t.estado,m.onclick=function(){!function(e){const t="1"===e.estado?"0":"1";e.estado=t,i(e)}({...t})};const p=document.createElement("BUTTON");p.classList.add("editar-tarea"),p.dataset.idTarea=t.id;const f=document.createElement("I");f.classList.add("fas","fa-pencil-alt"),p.appendChild(f),p.onclick=function(){o(!0,{...t})};const y=document.createElement("BUTTON");y.classList.add("eliminar-tarea"),y.dataset.idTarea=t.id;const h=document.createElement("I");h.classList.add("fas","fa-trash-alt"),y.appendChild(h),y.onclick=function(){!function(t){Swal.fire({title:"¿Eliminar Tarea?",showCancelButton:!0,confirmButtonText:"Si",cancelButtonText:"No"}).then((a=>{a.isConfirmed&&async function(t){c();const{estado:a,id:o,nombre:r}=t,i=new FormData;i.append("id",o),i.append("nombre",r),i.append("estado",a),i.append("proyectoId",s());try{const a="/api/tarea/eliminar",o=await fetch(a,{method:"POST",body:i}),r=await o.json();r.resultado&&(Swal.fire("Eliminado!",r.mensaje,"success"),e=e.filter((e=>e.id!==t.id)),n())}catch(e){console.log(e)}finally{d()}}(t)}))}({...t})},u.appendChild(m),u.appendChild(p),u.appendChild(y),a.appendChild(l),a.appendChild(u);document.querySelector("#listado-tareas").appendChild(a)}))}function o(t=!1,a={}){console.log(a);const o=document.createElement("DIV");o.classList.add("modal"),o.innerHTML=`\n            <form class="formulario nueva-tarea">\n                <legend>${t?"Editar Tarea":"Añade una nueva tarea"}</legend>\n                <div class="campo">\n                    <label>Tarea</label>\n                    <input \n                        type="text"\n                        name="tarea"\n                        placeholder="${a.nombre?"Edita la Tarea":"Añadir Tarea al Proyecto Actual"}"\n                        id="tarea"\n                        value="${a.nombre?a.nombre:""}"\n                        autofocus\n                    />\n                </div>\n                <div class="campo">\n                    <label>Descripción</label>\n                    <textarea \n                        type="text"\n                        name="descripcion"\n                        placeholder="${a.descripcion?"Edita la descripcion":"Añadir descripcion a la tarea Actual"}"\n                        id="descripcion"\n                        value="${a.descripcion?a.descripcion:""}"\n                        autofocus\n                    /></textarea>\n                </div>\n                <div class="opciones">\n                    <input \n                        type="submit" \n                        class="submit-nueva-tarea" \n                        value="${a.nombre?"Guardar Cambios":"Añadir Tarea"} " \n                    />\n                    <button type="button" class="cerrar-modal">Cancelar</button>\n                </div>\n            </form>\n        `,setTimeout((()=>{document.querySelector(".formulario").classList.add("animar"),document.querySelector("#tarea").focus()}),150),o.addEventListener("click",(function(l){if(l.preventDefault(),l.target.classList.contains("cerrar-modal")){document.querySelector(".formulario").classList.add("cerrar"),setTimeout((()=>{o.remove()}),500)}if(l.target.classList.contains("submit-nueva-tarea")){const o=document.querySelector("#tarea").value.trim();if(""===o)return void r("El Nombre de la tarea es Obligatorio","error");t?(a.nombre=o,i(a)):async function(t){c();const a=new FormData;a.append("nombre",t),a.append("proyectoId",s());try{const o="/api/tarea",c=await fetch(o,{method:"POST",body:a}),d=await c.json();if(r(d.mensaje,d.tipo,document.querySelector(".formulario legend")),"exito"===d.tipo){const a=document.querySelector(".modal");setTimeout((()=>{a.remove()}),500);const o={id:String(d.id),nombre:t,estado:"0",proyectoId:d.proyectoId};e=[...e,o],n()}}catch(e){console.log(e)}finally{d()}}(o)}})),document.querySelector(".dashboard").appendChild(o)}function r(e,t,a){const n=document.querySelector(".alerta");n&&n.remove();const o=document.createElement("DIV");o.classList.add("alerta",t),o.textContent=e,a.parentElement.insertBefore(o,a.nextElementSibling),setTimeout((()=>{o.remove()}),5e3)}function c(){const e=document.getElementById("loader");e&&(e.style.display="flex")}function d(){const e=document.getElementById("loader");e&&(e.style.display="none")}async function i(t){c();const{estado:a,id:o,nombre:r,proyectoId:i}=t,l=new FormData;l.append("id",o),l.append("nombre",r),l.append("estado",a),l.append("proyectoId",s());try{const t="/api/tarea/actualizar",c=await fetch(t,{method:"POST",body:l}),d=await c.json();if("exito"===d.respuesta.tipo){Swal.fire(d.respuesta.mensaje,d.respuesta.mensaje,"success");const t=document.querySelector(".modal");t&&t.remove(),e=e.map((e=>(e.id===o&&(e.estado=a,e.nombre=r),e))),n()}}catch(e){console.log(e)}finally{d()}}function s(){const e=new URLSearchParams(window.location.search);return Object.fromEntries(e.entries()).id}document.querySelectorAll('#filtros input[type="radio').forEach((e=>{e.addEventListener("input",a)})),document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".duplicar-proyecto").forEach((e=>{e.addEventListener("click",(function(e){e.preventDefault();!async function(e){try{const t=new FormData;t.append("id",e);const a="/duplicar-proyecto",n=await fetch(a,{method:"POST",body:t}),o=await n.json();o.resultado?(Swal.fire("Duplicado!",o.mensaje,"success"),location.reload()):Swal.fire("Error!","No se pudo duplicar el proyecto","error")}catch(e){console.error("Error al duplicar el proyecto:",e),Swal.fire("Error!","No se pudo duplicar el proyecto","error")}}(e.target.dataset.id)}))}))}))}();