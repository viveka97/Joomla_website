/* jce - 2.8.12 | 2020-05-12 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2020 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function(tinymce){function getSpanVal(td,name){return parseInt(td.getAttribute(name)||1)}function TableGrid(table,dom,selection,settings){function cloneNode(node,children){return node=node.cloneNode(children),node.removeAttribute("id"),node}function buildGrid(){var startY=0;grid=[],gridWidth=0,each(["thead","tbody","tfoot"],function(part){var rows=dom.select("> "+part+" tr",table);each(rows,function(tr,y){y+=startY,each(dom.select("> td, > th",tr),function(td,x){var x2,y2,rowspan,colspan;if(grid[y])for(;grid[y][x];)x++;for(rowspan=getSpanVal(td,"rowspan"),colspan=getSpanVal(td,"colspan"),y2=y;y2<y+rowspan;y2++)for(grid[y2]||(grid[y2]=[]),x2=x;x2<x+colspan;x2++)grid[y2][x2]={part:part,real:y2==y&&x2==x,elm:td,rowspan:rowspan,colspan:colspan};gridWidth=Math.max(gridWidth,x+1)})}),startY+=rows.length})}function getCell(x,y){var row;if(row=grid[y])return row[x]}function setSpanVal(td,name,val){td&&(val=parseInt(val),1===val?td.removeAttribute(name,1):td.setAttribute(name,val,1))}function isCellSelected(cell){return cell&&(dom.hasClass(cell.elm,"mceSelected")||cell==selectedCell)}function getSelectedRows(){var rows=[];return each(table.rows,function(row){each(row.cells,function(cell){if(dom.hasClass(cell,"mceSelected")||cell==selectedCell.elm)return rows.push(row),!1})}),rows}function deleteTable(){var rng=dom.createRng();rng.setStartAfter(table),rng.setEndAfter(table),selection.setRng(rng),dom.remove(table)}function cloneCell(cell){var formatNode,cloneFormats={};return settings.table_clone_elements&&(cloneFormats=tinymce.makeMap((settings.table_clone_elements||"strong em b i span font h1 h2 h3 h4 h5 h6 p div").toUpperCase(),/[ ,]/)),tinymce.walk(cell,function(node){var curNode;if(3==node.nodeType)return each(dom.getParents(node.parentNode,null,cell).reverse(),function(node){cloneFormats[node.nodeName]&&(node=cloneNode(node,!1),formatNode?curNode&&curNode.appendChild(node):formatNode=curNode=node,curNode=node)}),curNode&&(curNode.innerHTML=tinymce.isIE&&!tinymce.isIE11?"&nbsp;":'<br data-mce-bogus="1" />'),!1},"childNodes"),cell=cloneNode(cell,!1),setSpanVal(cell,"rowSpan",1),setSpanVal(cell,"colSpan",1),formatNode?cell.appendChild(formatNode):tinymce.isIE&&!tinymce.isIE11||(cell.innerHTML='<br data-mce-bogus="1" />'),cell}function cleanup(){var rng=dom.createRng();return each(dom.select("tr",table),function(tr){0==tr.cells.length&&dom.remove(tr)}),0==dom.select("tr",table).length?(rng.setStartAfter(table),rng.setEndAfter(table),selection.setRng(rng),void dom.remove(table)):(each(dom.select("thead,tbody,tfoot",table),function(part){0==part.rows.length&&dom.remove(part)}),buildGrid(),row=grid[Math.min(grid.length-1,startPos.y)],void(row&&(selection.select(row[Math.min(row.length-1,startPos.x)].elm,!0),selection.collapse(!0))))}function fillLeftDown(x,y,rows,cols){var tr,x2,r,c,cell;for(tr=grid[y][x].elm.parentNode,r=1;r<=rows;r++)if(tr=dom.getNext(tr,"tr")){for(x2=x;x2>=0;x2--)if(cell=grid[y+r][x2].elm,cell.parentNode==tr){for(c=1;c<=cols;c++)dom.insertAfter(cloneCell(cell),cell);break}if(x2==-1)for(c=1;c<=cols;c++)tr.insertBefore(cloneCell(tr.cells[0]),tr.cells[0])}}function split(){each(grid,function(row,y){each(row,function(cell,x){var colSpan,rowSpan,i;if(isCellSelected(cell)&&(cell=cell.elm,colSpan=getSpanVal(cell,"colspan"),rowSpan=getSpanVal(cell,"rowspan"),colSpan>1||rowSpan>1)){for(setSpanVal(cell,"rowSpan",1),setSpanVal(cell,"colSpan",1),i=0;i<colSpan-1;i++)dom.insertAfter(cloneCell(cell),cell);fillLeftDown(x,y,rowSpan-1,colSpan)}})})}function merge(cell,cols,rows){var startX,startY,endX,endY,x,y,startCell,endCell,cell,children,count;if(cell?(pos=getPos(cell),startX=pos.x,startY=pos.y,endX=startX+(cols-1),endY=startY+(rows-1)):(startPos=endPos=null,each(grid,function(row,y){each(row,function(cell,x){isCellSelected(cell)&&(startPos||(startPos={x:x,y:y}),endPos={x:x,y:y})})}),startX=startPos.x,startY=startPos.y,endX=endPos.x,endY=endPos.y),startCell=getCell(startX,startY),endCell=getCell(endX,endY),startCell&&endCell&&startCell.part==endCell.part){for(split(),buildGrid(),startCell=getCell(startX,startY).elm,setSpanVal(startCell,"colSpan",endX-startX+1),setSpanVal(startCell,"rowSpan",endY-startY+1),y=startY;y<=endY;y++)for(x=startX;x<=endX;x++)grid[y]&&grid[y][x]&&(cell=grid[y][x].elm,cell!=startCell&&(children=tinymce.grep(cell.childNodes),each(children,function(node){startCell.appendChild(node)}),children.length&&(children=tinymce.grep(startCell.childNodes),count=0,each(children,function(node){"BR"==node.nodeName&&dom.getAttrib(node,"data-mce-bogus")&&count++<children.length-1&&startCell.removeChild(node)})),dom.remove(cell)));cleanup()}}function insertRow(before){var posY,cell,lastCell,x,rowElm,newRow,newCell,otherCell,rowSpan;for(each(grid,function(row,y){if(each(row,function(cell,x){if(isCellSelected(cell)&&(cell=cell.elm,rowElm=cell.parentNode,newRow=cloneNode(rowElm,!1),posY=y,before))return!1}),before)return!posY}),x=0;x<grid[0].length;x++)if(grid[posY][x]&&(cell=grid[posY][x].elm,cell!=lastCell)){if(before){if(posY>0&&grid[posY-1][x]&&(otherCell=grid[posY-1][x].elm,rowSpan=getSpanVal(otherCell,"rowSpan"),rowSpan>1)){setSpanVal(otherCell,"rowSpan",rowSpan+1);continue}}else if(rowSpan=getSpanVal(cell,"rowspan"),rowSpan>1){setSpanVal(cell,"rowSpan",rowSpan+1);continue}newCell=cloneCell(cell),setSpanVal(newCell,"colSpan",cell.colSpan),newRow.appendChild(newCell),lastCell=cell}newRow.hasChildNodes()&&(before?rowElm.parentNode.insertBefore(newRow,rowElm):dom.insertAfter(newRow,rowElm))}function insertCol(before){var posX,lastCell;each(grid,function(row,y){if(each(row,function(cell,x){if(isCellSelected(cell)&&(posX=x,before))return!1}),before)return!posX}),each(grid,function(row,y){var cell,rowSpan,colSpan;row[posX]&&(cell=row[posX].elm,cell!=lastCell&&(colSpan=getSpanVal(cell,"colspan"),rowSpan=getSpanVal(cell,"rowspan"),1==colSpan?before?(cell.parentNode.insertBefore(cloneCell(cell),cell),fillLeftDown(posX,y,rowSpan-1,colSpan)):(dom.insertAfter(cloneCell(cell),cell),fillLeftDown(posX,y,rowSpan-1,colSpan)):setSpanVal(cell,"colSpan",cell.colSpan+1),lastCell=cell))})}function deleteCols(){var cols=[];each(grid,function(row,y){each(row,function(cell,x){isCellSelected(cell)&&tinymce.inArray(cols,x)===-1&&(each(grid,function(row){var colSpan,cell=row[x].elm;colSpan=getSpanVal(cell,"colSpan"),colSpan>1?setSpanVal(cell,"colSpan",colSpan-1):dom.remove(cell)}),cols.push(x))})}),cleanup()}function deleteRows(){function deleteRow(tr){var nextTr,pos,lastCell;nextTr=dom.getNext(tr,"tr"),each(tr.cells,function(cell){var rowSpan=getSpanVal(cell,"rowSpan");rowSpan>1&&(setSpanVal(cell,"rowSpan",rowSpan-1),pos=getPos(cell),fillLeftDown(pos.x,pos.y,1,1))}),pos=getPos(tr.cells[0]),each(grid[pos.y],function(cell){var rowSpan;cell=cell.elm,cell!=lastCell&&(rowSpan=getSpanVal(cell,"rowSpan"),rowSpan<=1?dom.remove(cell):setSpanVal(cell,"rowSpan",rowSpan-1),lastCell=cell)})}var rows;rows=getSelectedRows(),each(rows.reverse(),function(tr){deleteRow(tr)}),cleanup()}function cutRows(){var rows=getSelectedRows();return dom.remove(rows),cleanup(),rows}function copyRows(){var rows=getSelectedRows();return each(rows,function(row,i){rows[i]=cloneNode(row,!0)}),rows}function pasteRows(rows,before){if(rows){var selectedRows=getSelectedRows(),targetRow=selectedRows[before?0:selectedRows.length-1],targetCellCount=targetRow.cells.length;each(grid,function(row){var match;if(targetCellCount=0,each(row,function(cell,x){cell.real&&(targetCellCount+=cell.colspan),cell.elm.parentNode==targetRow&&(match=1)}),match)return!1}),before||rows.reverse(),each(rows,function(row){var cell,cellCount=row.cells.length;for(i=0;i<cellCount;i++)cell=row.cells[i],setSpanVal(cell,"colSpan",1),setSpanVal(cell,"rowSpan",1);for(i=cellCount;i<targetCellCount;i++)row.appendChild(cloneCell(row.cells[cellCount-1]));for(i=targetCellCount;i<cellCount;i++)dom.remove(row.cells[i]);before?targetRow.parentNode.insertBefore(row,targetRow):dom.insertAfter(row,targetRow)}),dom.removeClass(dom.select("td.mceSelected,th.mceSelected"),"mceSelected")}}function getPos(target){var pos;return each(grid,function(row,y){return each(row,function(cell,x){if(cell.elm==target)return pos={x:x,y:y},!1}),!pos}),pos}function setStartCell(cell){startPos=getPos(cell)}function findEndPos(){var maxX,maxY;return maxX=maxY=0,each(grid,function(row,y){each(row,function(cell,x){var colSpan,rowSpan;isCellSelected(cell)&&(cell=grid[y][x],x>maxX&&(maxX=x),y>maxY&&(maxY=y),cell.real&&(colSpan=cell.colspan-1,rowSpan=cell.rowspan-1,colSpan&&x+colSpan>maxX&&(maxX=x+colSpan),rowSpan&&y+rowSpan>maxY&&(maxY=y+rowSpan)))})}),{x:maxX,y:maxY}}function setEndCell(cell){var startX,startY,endX,endY,maxX,maxY,colSpan,rowSpan;if(endPos=getPos(cell),startPos&&endPos){for(startX=Math.min(startPos.x,endPos.x),startY=Math.min(startPos.y,endPos.y),endX=Math.max(startPos.x,endPos.x),endY=Math.max(startPos.y,endPos.y),maxX=endX,maxY=endY,y=startY;y<=maxY;y++)cell=grid[y][startX],cell.real||startX-(cell.colspan-1)<startX&&(startX-=cell.colspan-1);for(x=startX;x<=maxX;x++)cell=grid[startY][x],cell.real||startY-(cell.rowspan-1)<startY&&(startY-=cell.rowspan-1);for(y=startY;y<=endY;y++)for(x=startX;x<=endX;x++)cell=grid[y][x],cell.real&&(colSpan=cell.colspan-1,rowSpan=cell.rowspan-1,colSpan&&x+colSpan>maxX&&(maxX=x+colSpan),rowSpan&&y+rowSpan>maxY&&(maxY=y+rowSpan));for(dom.removeClass(dom.select("td.mceSelected,th.mceSelected"),"mceSelected"),y=startY;y<=maxY;y++)for(x=startX;x<=maxX;x++)grid[y][x]&&dom.addClass(grid[y][x].elm,"mceSelected")}}function moveRelIdx(cellElm,delta){var pos,index,cell;pos=getPos(cellElm),index=pos.y*gridWidth+pos.x;do{if(index+=delta,cell=getCell(index%gridWidth,Math.floor(index/gridWidth)),!cell)break;if(cell.elm!=cellElm)return selection.select(cell.elm,!0),dom.isEmpty(cell.elm)&&selection.collapse(!0),!0}while(cell.elm==cellElm);return!1}var grid,startPos,endPos,selectedCell,gridWidth;buildGrid(),selectedCell=dom.getParent(selection.getStart(),"th,td"),selectedCell&&(startPos=getPos(selectedCell),endPos=findEndPos(),selectedCell=getCell(startPos.x,startPos.y)),tinymce.extend(this,{deleteTable:deleteTable,split:split,merge:merge,insertRow:insertRow,insertCol:insertCol,deleteCols:deleteCols,deleteRows:deleteRows,cutRows:cutRows,copyRows:copyRows,pasteRows:pasteRows,getPos:getPos,setStartCell:setStartCell,setEndCell:setEndCell,moveRelIdx:moveRelIdx,refresh:buildGrid})}var DOM=tinymce.DOM,Event=tinymce.dom.Event,each=(tinymce.is,tinymce.each),VK=tinymce.VK,TreeWalker=tinymce.dom.TreeWalker;tinymce.create("tinymce.plugins.TablePlugin",{init:function(ed,url){function createTableGrid(node){var selection=ed.selection,tblElm=ed.dom.getParent(node||selection.getNode(),"table");if(tblElm)return new TableGrid(tblElm,ed.dom,selection,ed.settings)}function cleanup(force){ed.getBody().style.webkitUserSelect="",(force||hasCellSelection)&&(ed.dom.removeClass(ed.dom.select("td.mceSelected,th.mceSelected"),"mceSelected"),hasCellSelection=!1)}var winMan,clipboardRows,hasCellSelection=!0;this.editor=ed,ed.addButton("table","table.desc","mceInsertTable",!0),ed.getParam("table_buttons",1)&&each([["table","table.desc","mceInsertTable",!0],["delete_table","table.del","mceTableDelete"],["delete_col","table.delete_col_desc","mceTableDeleteCol"],["delete_row","table.delete_row_desc","mceTableDeleteRow"],["col_after","table.col_after_desc","mceTableInsertColAfter"],["col_before","table.col_before_desc","mceTableInsertColBefore"],["row_after","table.row_after_desc","mceTableInsertRowAfter"],["row_before","table.row_before_desc","mceTableInsertRowBefore"],["row_props","table.row_desc","mceTableRowProps",!0],["cell_props","table.cell_desc","mceTableCellProps",!0],["split_cells","table.split_cells_desc","mceTableSplitCells",!0],["merge_cells","table.merge_cells_desc","mceTableMergeCells",!0]],function(c){ed.addButton(c[0],{title:c[1],cmd:c[2],ui:c[3]})}),ed.onPreInit.add(function(){ed.onSetContent.add(function(ed,e){cleanup(!0)})}),ed.onPreProcess.add(function(ed,args){var nodes,i,node,value,dom=ed.dom;if("html4"===ed.settings.schema)for(nodes=dom.select("table,td,th,tr",args.node),i=nodes.length;i--;){node=nodes[i],dom.setAttrib(node,"data-mce-style",""),"auto"===dom.getStyle(node,"margin-left")&&"auto"===dom.getStyle(node,"margin-right")&&(dom.setAttrib(node,"align","center"),dom.setStyles(node,{"margin-left":"","margin-right":""}));var flt=dom.getStyle(node,"float");"left"!==flt&&"right"!==flt||(dom.setAttrib(node,"align",flt),dom.setStyle(node,"float",""));var textAlign=dom.getStyle(node,"text-align");textAlign&&(dom.setAttrib(node,"align",textAlign),dom.setStyle(node,"text-align",""))}for(nodes=dom.select("table, td, th",args.node),i=nodes.length;i--;)node=nodes[i],(value=dom.getAttrib(node,"width"))&&("number"==typeof value&&(value+="px"),node.style.width=value,dom.setAttrib(node,"width","")),(value=dom.getAttrib(node,"height"))&&("number"==typeof value&&(value+="px"),node.style.height=value,dom.setAttrib(node,"height",""))}),ed.onNodeChange.add(function(ed,cm,n){var p;n=ed.selection.getStart(),p=ed.dom.getParent(n,"td,th,caption"),cm.setActive("table","TABLE"===n.nodeName||!!p),p&&"CAPTION"===p.nodeName&&(p=0),ed.getParam("table_buttons",1)&&(cm.setDisabled("delete_table",!p),cm.setDisabled("delete_col",!p),cm.setDisabled("delete_table",!p),cm.setDisabled("delete_row",!p),cm.setDisabled("col_after",!p),cm.setDisabled("col_before",!p),cm.setDisabled("row_after",!p),cm.setDisabled("row_before",!p),cm.setDisabled("row_props",!p),cm.setDisabled("cell_props",!p),cm.setDisabled("split_cells",!p),cm.setDisabled("merge_cells",!p),cm.setDisabled("table_props",!p))}),ed.onClick.add(function(ed,e){var n=e.target;e.altKey&&ed.dom.is(n,"td,th,caption")&&(n=ed.dom.getParent(n,"table")),"TABLE"==n.nodeName&&(ed.selection.select(n),ed.nodeChanged())}),ed.onInit.add(function(ed){function isCellInTable(table,cell){return!(!table||!cell)&&table===dom.getParent(cell,"table")}function fixDragSelection(){var startCell,startTable,lastMouseOverTarget;ed.onMouseDown.add(function(ed,e){2!=e.button&&(cleanup(),startCell=dom.getParent(e.target,"td,th"),startTable=dom.getParent(startCell,"table"))}),dom.bind(ed.getDoc(),"mouseover",function(e){var sel,currentCell,target=e.target;if(!resizing&&!dragging&&target!==lastMouseOverTarget&&(lastMouseOverTarget=target,startTable&&startCell)){if(currentCell=dom.getParent(target,"td,th"),isCellInTable(startTable,currentCell)||(currentCell=dom.getParent(startTable,"td,th")),startCell===currentCell&&!hasCellSelection)return;if(isCellInTable(startTable,currentCell)){e.preventDefault(),tableGrid||(tableGrid=createTableGrid(startTable),tableGrid.setStartCell(startCell),ed.getBody().style.webkitUserSelect="none"),tableGrid.setEndCell(currentCell),hasCellSelection=!0,sel=ed.selection.getSel();try{sel.removeAllRanges?sel.removeAllRanges():sel.empty()}catch(ex){}}}}),ed.onMouseUp.add(function(){function setPoint(node,start){var walker=new TreeWalker(node,node);do{if(3==node.nodeType)return void(start?rng.setStart(node,0):rng.setEnd(node,node.nodeValue.length));if("BR"==node.nodeName)return void(start?rng.setStartBefore(node):rng.setEndBefore(node))}while(node=start?walker.next():walker.prev())}var rng,selectedCells,walker,node,lastNode,sel=ed.selection;if(startCell){if(tableGrid&&(ed.getBody().style.webkitUserSelect=""),selectedCells=dom.select("td.mceSelected,th.mceSelected"),selectedCells.length>0){var parent=dom.getParent(selectedCells[0],"table");rng=dom.createRng(),node=selectedCells[0],rng.setStartBefore(node),rng.setEndAfter(node),setPoint(node,1),walker=new TreeWalker(node,parent);do if("TD"==node.nodeName||"TH"==node.nodeName){if(!dom.hasClass(node,"mceSelected"))break;lastNode=node}while(node=walker.next());setPoint(lastNode),sel.setRng(rng)}ed.nodeChanged(),startCell=tableGrid=startTable=lastMouseOverTarget=null}})}function moveWebKitSelection(){function eventHandler(e){function handle(upBool,sourceNode){var siblingDirection=upBool?"previousSibling":"nextSibling",currentRow=ed.dom.getParent(sourceNode,"tr"),siblingRow=currentRow[siblingDirection];if(siblingRow)return moveCursorToRow(editor,sourceNode,siblingRow,upBool),e.preventDefault(),!0;var tableNode=ed.dom.getParent(currentRow,"table"),middleNode=currentRow.parentNode,parentNodeName=middleNode.nodeName.toLowerCase();if("tbody"===parentNodeName||parentNodeName===(upBool?"tfoot":"thead")){var targetParent=getTargetParent(upBool,tableNode,middleNode,"tbody");if(null!==targetParent)return moveToRowInTarget(upBool,targetParent,sourceNode)}return escapeTable(upBool,currentRow,siblingDirection,tableNode)}function getTargetParent(upBool,topNode,secondNode,nodeName){var tbodies=ed.dom.select(">"+nodeName,topNode),position=tbodies.indexOf(secondNode);if(upBool&&0===position||!upBool&&position===tbodies.length-1)return getFirstHeadOrFoot(upBool,topNode);if(position===-1){var topOrBottom="thead"===secondNode.tagName.toLowerCase()?0:tbodies.length-1;return tbodies[topOrBottom]}return tbodies[position+(upBool?-1:1)]}function getFirstHeadOrFoot(upBool,parent){var tagName=upBool?"thead":"tfoot",headOrFoot=ed.dom.select(">"+tagName,parent);return 0!==headOrFoot.length?headOrFoot[0]:null}function moveToRowInTarget(upBool,targetParent,sourceNode){var targetRow=getChildForDirection(targetParent,upBool);return targetRow&&moveCursorToRow(editor,sourceNode,targetRow,upBool),e.preventDefault(),!0}function escapeTable(upBool,currentRow,siblingDirection,table){var tableSibling=table[siblingDirection];if(tableSibling)return moveCursorToStartOfElement(tableSibling),!0;var parentCell=ed.dom.getParent(table,"td,th");if(parentCell)return handle(upBool,parentCell,e);var backUpSibling=getChildForDirection(currentRow,!upBool);return moveCursorToStartOfElement(backUpSibling),e.preventDefault(),!1}function getChildForDirection(parent,up){var child=parent&&parent[up?"lastChild":"firstChild"];return child&&"BR"===child.nodeName?ed.dom.getParent(child,"td,th"):child}function moveCursorToStartOfElement(n){ed.selection.setCursorLocation(n,0)}function isVerticalMovement(){return key==VK.UP||key==VK.DOWN}function isInTable(editor){var node=ed.selection.getNode(),currentRow=ed.dom.getParent(node,"tr");return null!==currentRow}function columnIndex(column){for(var colIndex=0,c=column;c.previousSibling;)c=c.previousSibling,colIndex+=getSpanVal(c,"colspan");return colIndex}function findColumn(rowElement,columnIndex){var c=0,r=0;return each(rowElement.children,function(cell,i){if(c+=getSpanVal(cell,"colspan"),r=i,c>columnIndex)return!1}),r}function moveCursorToRow(ed,node,row,upBool){var srcColumnIndex=columnIndex(ed.dom.getParent(node,"td,th")),tgtColumnIndex=findColumn(row,srcColumnIndex),tgtNode=row.childNodes[tgtColumnIndex],rowCellTarget=getChildForDirection(tgtNode,upBool);moveCursorToStartOfElement(rowCellTarget||tgtNode)}function shouldFixCaret(preBrowserNode){var newNode=ed.selection.getNode(),newParent=ed.dom.getParent(newNode,"td,th"),oldParent=ed.dom.getParent(preBrowserNode,"td,th");return newParent&&newParent!==oldParent&&checkSameParentTable(newParent,oldParent)}function checkSameParentTable(nodeOne,NodeTwo){return ed.dom.getParent(nodeOne,"TABLE")===ed.dom.getParent(NodeTwo,"TABLE")}var key=e.keyCode;if(isVerticalMovement()&&isInTable(editor)){var preBrowserNode=ed.selection.getNode();Delay.setEditorTimeout(editor,function(){shouldFixCaret(preBrowserNode)&&handle(!e.shiftKey&&key===VK.UP,preBrowserNode,e)},0)}}ed.onKeyDown.add(function(e){eventHandler(e)})}function fixBeforeTableCaretBug(){function isAtStart(rng,par){var elm,doc=par.ownerDocument,rng2=doc.createRange();return rng2.setStartBefore(par),rng2.setEnd(rng.endContainer,rng.endOffset),elm=doc.createElement("body"),elm.appendChild(rng2.cloneContents()),0===elm.innerHTML.replace(/<(br|img|object|embed|input|textarea)[^>]*>/gi,"-").replace(/<[^>]+>/g,"").length}ed.onKeyDown.add(function(e){var rng,table,dom=ed.dom;37!=e.keyCode&&38!=e.keyCode||(rng=ed.selection.getRng(),table=dom.getParent(rng.startContainer,"table"),table&&ed.getBody().firstChild==table&&isAtStart(rng,table)&&(rng=dom.createRng(),rng.setStartBefore(table),rng.setEndBefore(table),ed.selection.setRng(rng),e.preventDefault()))})}function fixTableCaretPos(){ed.dom.bind("KeyDown SetContent VisualAid",function(){var last;for(last=ed.getBody().lastChild;last;last=last.previousSibling)if(3==last.nodeType){if(last.nodeValue.length>0)break}else if(1==last.nodeType&&("BR"==last.tagName||!last.getAttribute("data-mce-bogus")))break;last&&"TABLE"==last.nodeName&&(ed.settings.forced_root_block?ed.dom.add(ed.getBody(),ed.settings.forced_root_block,ed.settings.forced_root_block_attrs,tinymce.isIE&&tinymce.isIE<10?"&nbsp;":'<br data-mce-bogus="1" />'):ed.dom.add(ed.getBody(),"br",{"data-mce-bogus":"1"}))}),ed.onPreProcess.add(function(ed,o){var last=o.node.lastChild;last&&("BR"==last.nodeName||1==last.childNodes.length&&("BR"==last.firstChild.nodeName||" "==last.firstChild.nodeValue))&&last.previousSibling&&"TABLE"==last.previousSibling.nodeName&&ed.dom.remove(last)})}function fixTableCellSelection(){function tableCellSelected(ed,rng,n,currentCell){var tableParent,allOfCellSelected,tableCellSelection,TEXT_NODE=3,table=ed.dom.getParent(rng.startContainer,"TABLE");return table&&(tableParent=table.parentNode),allOfCellSelected=rng.startContainer.nodeType==TEXT_NODE&&0===rng.startOffset&&0===rng.endOffset&&currentCell&&("TR"==n.nodeName||n==tableParent),tableCellSelection=("TD"==n.nodeName||"TH"==n.nodeName)&&!currentCell,allOfCellSelected||tableCellSelection}function fixSelection(){var rng=ed.selection.getRng(),n=ed.selection.getNode(),currentCell=ed.dom.getParent(rng.startContainer,"TD,TH");if(tableCellSelected(ed,rng,n,currentCell)){currentCell||(currentCell=n);for(var end=currentCell.lastChild;end.lastChild;)end=end.lastChild;3==end.nodeType&&(rng.setEnd(end,end.data.length),ed.selection.setRng(rng))}}ed.onKeyDown.add(function(){fixSelection()}),ed.onMouseDown.add(function(e){2!=e.button&&fixSelection()})}function deleteTable(){function placeCaretInCell(cell){ed.selection.select(cell,!0),ed.selection.collapse(!0)}function clearCell(cell){ed.dom.empty(cell),paddCell(cell)}ed.onKeyDown.add(function(e){if((e.keyCode==VK.DELETE||e.keyCode==VK.BACKSPACE)&&!e.isDefaultPrevented()){var table,tableCells,selectedTableCells,cell;if(table=ed.dom.getParent(ed.selection.getStart(),"table")){if(tableCells=ed.dom.select("td,th",table),selectedTableCells=tinymce.grep(tableCells,function(cell){return!!ed.dom.getAttrib(cell,"data-mce-selected")}),0===selectedTableCells.length)return cell=ed.dom.getParent(ed.selection.getStart(),"td,th"),void(ed.selection.isCollapsed()&&cell&&ed.dom.isEmpty(cell)&&(e.preventDefault(),clearCell(cell),placeCaretInCell(cell)));e.preventDefault(),ed.undoManager.add(),tableCells.length==selectedTableCells.length?ed.execCommand("mceTableDelete"):(tinymce.each(selectedTableCells,clearCell),placeCaretInCell(selectedTableCells[0]))}}})}function handleDeleteInCaption(){var isTableCaptionNode=function(node){return node&&"CAPTION"==node.nodeName&&"TABLE"==node.parentNode.nodeName},restoreCaretPlaceholder=function(node,insertCaret){var rng=ed.selection.getRng(),caretNode=node.ownerDocument.createTextNode(" ");rng.startOffset?node.insertBefore(caretNode,node.firstChild):node.appendChild(caretNode),insertCaret&&(ed.selection.select(caretNode,!0),ed.selection.collapse(!0))},deleteBtnPressed=function(e){return(e.keyCode==VK.DELETE||e.keyCode==VK.BACKSPACE)&&!e.isDefaultPrevented()},getSingleChildNode=function(node){return node.firstChild===node.lastChild&&node.firstChild},isTextNode=function(node){return node&&3===node.nodeType},getSingleChr=function(node){var childNode=getSingleChildNode(node);return isTextNode(childNode)&&1===childNode.data.length?childNode.data:null},hasNoCaretPlaceholder=function(node){var childNode=getSingleChildNode(node),chr=getSingleChr(node);return childNode&&!isTextNode(childNode)||chr&&!isNBSP(chr)},isEmptyNode=function(node){return ed.dom.isEmpty(node)||isNBSP(getSingleChr(node))},isNBSP=function(chr){return" "===chr};ed.onKeyDown.add(function(e){if(deleteBtnPressed(e)){var container=ed.dom.getParent(ed.selection.getStart(),"caption");isTableCaptionNode(container)&&(tinymce.isIE&&(ed.selection.isCollapsed()?hasNoCaretPlaceholder(container)&&restoreCaretPlaceholder(container):(ed.undoManager.add(),ed.execCommand("Delete"),isEmptyNode(container)&&restoreCaretPlaceholder(container,!0),e.preventDefault())),isEmptyNode(container)&&e.preventDefault())}})}var tableGrid,resizing,dragging,dom=ed.dom;winMan=ed.windowManager,"html4"===ed.settings.schema&&tinymce.each("left,center,right,full".split(","),function(name){var fmts=ed.formatter.get("align"+name);tinymce.each(fmts,function(fmt){fmt.onformat=function(elm,fmt){/^(TABLE|TH|TD|TR)$/.test(elm.nodeName)&&("full"===name&&(name="justify"),ed.dom.setAttrib(elm,"align",name))}})}),ed.onKeyUp.add(function(ed,e){cleanup()}),deleteTable(),handleDeleteInCaption(),fixDragSelection(),tinymce.isWebKit&&(moveWebKitSelection(),fixTableCellSelection()),tinymce.isGecko&&(fixBeforeTableCaretBug(),fixTableCaretPos()),(tinymce.isIE>9||tinymce.isIE12)&&(fixBeforeTableCaretBug(),fixTableCaretPos()),ed&&ed.plugins.contextmenu&&ed.plugins.contextmenu.onContextMenu.add(function(th,m,e){var sm,se=ed.selection;se.getNode()||ed.getBody();ed.dom.getParent(e,"td")||ed.dom.getParent(e,"th")||ed.dom.select("td.mceSelected,th.mceSelected").length?(m.add({title:"table.desc",icon:"table",cmd:"mceInsertTable",value:{action:"insert"}}),m.add({title:"table.props_desc",icon:"table_props",cmd:"mceInsertTable"}),m.add({title:"table.del",icon:"delete_table",cmd:"mceTableDelete"}),m.addSeparator(),sm=m.addMenu({title:"table.cell"}),sm.add({title:"table.cell_desc",icon:"cell_props",cmd:"mceTableCellProps"}),sm.add({title:"table.split_cells_desc",icon:"split_cells",cmd:"mceTableSplitCells"}),sm.add({title:"table.merge_cells_desc",icon:"merge_cells",cmd:"mceTableMergeCells"}),sm=m.addMenu({title:"table.row"}),sm.add({title:"table.row_desc",icon:"row_props",cmd:"mceTableRowProps"}),sm.add({title:"table.row_before_desc",icon:"row_before",cmd:"mceTableInsertRowBefore"}),sm.add({title:"table.row_after_desc",icon:"row_after",cmd:"mceTableInsertRowAfter"}),sm.add({title:"table.delete_row_desc",icon:"delete_row",cmd:"mceTableDeleteRow"}),sm.addSeparator(),sm.add({title:"table.cut_row_desc",icon:"cut",cmd:"mceTableCutRow"}),sm.add({title:"table.copy_row_desc",icon:"copy",cmd:"mceTableCopyRow"}),sm.add({title:"table.paste_row_before_desc",icon:"paste",cmd:"mceTablePasteRowBefore"}).setDisabled(!clipboardRows),sm.add({title:"table.paste_row_after_desc",icon:"paste",cmd:"mceTablePasteRowAfter"}).setDisabled(!clipboardRows),sm=m.addMenu({title:"table.col"}),sm.add({title:"table.col_before_desc",icon:"col_before",cmd:"mceTableInsertColBefore"}),sm.add({title:"table.col_after_desc",icon:"col_after",cmd:"mceTableInsertColAfter"}),sm.add({title:"table.delete_col_desc",icon:"delete_col",cmd:"mceTableDeleteCol"})):m.add({title:"table.desc",icon:"table",cmd:"mceInsertTable"})})});var url=ed.getParam("site_url")+"index.php?option=com_jce&task=plugin.display&plugin=table";each({mceTableSplitCells:function(grid){grid.split()},mceTableMergeCells:function(grid){var rowSpan,colSpan,cell;cell=ed.dom.getParent(ed.selection.getNode(),"th,td"),cell&&(rowSpan=cell.rowSpan,colSpan=cell.colSpan),ed.dom.select("td.mceSelected,th.mceSelected").length?grid.merge():winMan.open({url:url+"&layout=merge",width:240+parseInt(ed.getLang("table.merge_cells_delta_width",0)),height:170+parseInt(ed.getLang("table.merge_cells_delta_height",0)),inline:1,size:"mce-modal-landscape-small"},{rows:rowSpan,cols:colSpan,onaction:function(data){grid.merge(cell,data.cols,data.rows)},plugin_url:url,layout:"merge",size:"mce-modal-landscape-small"})},mceTableInsertRowBefore:function(grid){grid.insertRow(!0)},mceTableInsertRowAfter:function(grid){grid.insertRow()},mceTableInsertColBefore:function(grid){grid.insertCol(!0)},mceTableInsertColAfter:function(grid){grid.insertCol()},mceTableDeleteCol:function(grid){grid.deleteCols()},mceTableDeleteRow:function(grid){grid.deleteRows()},mceTableCutRow:function(grid){clipboardRows=grid.cutRows()},mceTableCopyRow:function(grid){clipboardRows=grid.copyRows()},mceTablePasteRowBefore:function(grid){grid.pasteRows(clipboardRows,!0)},mceTablePasteRowAfter:function(grid){grid.pasteRows(clipboardRows)},mceTableDelete:function(grid){grid.deleteTable()}},function(func,name){ed.addCommand(name,function(){var grid=createTableGrid();grid&&(func(grid),ed.execCommand("mceRepaint"),cleanup())})}),each({mceInsertTable:function(val){winMan.open({url:url,width:800+parseInt(ed.getLang("table.table_delta_width",0)),height:450+parseInt(ed.getLang("table.table_delta_height",0)),size:"mce-modal-landscape-xlarge"},{plugin_url:url,action:val?val.action:0,layout:"table"})},mceTableRowProps:function(){winMan.open({url:url+"&layout=row",width:800+parseInt(ed.getLang("table.rowprops_delta_width",0)),height:450+parseInt(ed.getLang("table.rowprops_delta_height",0)),size:"mce-modal-landscape-xlarge"},{plugin_url:url,layout:"row"})},mceTableCellProps:function(){winMan.open({url:url+"&layout=cell",width:800+parseInt(ed.getLang("table.cellprops_delta_width",0)),height:450+parseInt(ed.getLang("table.cellprops_delta_height",0)),size:"mce-modal-landscape-xlarge"},{plugin_url:url,layout:"cell"})}},function(func,name){ed.addCommand(name,function(ui,val){func(val)})}),ed.settings.table_tab_navigation!==!1&&ed.onKeyDown.add(function(ed,e){var cellElm,grid,delta;9==e.keyCode&&(cellElm=ed.dom.getParent(ed.selection.getStart(),"th,td"),cellElm&&(e.preventDefault(),grid=createTableGrid(),delta=e.shiftKey?-1:1,ed.undoManager.add(),!grid.moveRelIdx(cellElm,delta)&&delta>0&&(grid.insertRow(),grid.refresh(),grid.moveRelIdx(cellElm,delta))))})},createControl:function(n,cm){function createMenuGrid(cols,rows){var html='<table role="presentation" class="mceTableSplitMenu"><tbody>';for(i=0;i<rows;i++){for(html+="<tr>",x=0;x<cols;x++)html+='<td><a href="#"></a></td>';html+="</tr>"}return html+="</tbody>",html+='<tfoot><tr><td colspan="'+rows+'" class="mceTableGridCount">&nbsp;</td></tr></tfoot>',html+="</table>"}function menuGridMouseOver(e){var el=e.target;"TD"!==el.nodeName&&(el=el.parentNode);var tbody=DOM.getParent(el,"tbody");if(tbody){var i,z,rows=tbody.childNodes,row=el.parentNode,x=tinymce.inArray(row.childNodes,el),y=tinymce.inArray(rows,row);if(!(x<0||y<0)){for(i=0;i<rows.length;i++)for(cells=rows[i].childNodes,z=0;z<cells.length;z++)z>x||i>y?DOM.removeClass(cells[z],"selected"):DOM.addClass(cells[z],"selected");DOM.setHTML(DOM.select("td.mceTableGridCount",n),y+1+" x "+(x+1))}}}function menuGridClick(e){var el=e.target,bookmark=0;"TD"!==el.nodeName&&(el=el.parentNode);var table=DOM.getParent(el,"table"),styles=[],width=ed.getParam("table_default_width");/^[0-9\.]+$/.test(width)&&(width+="px"),width&&styles.push("width:"+width);var height=ed.getParam("table_default_height");/^[0-9\.]+$/.test(height)&&(height+="px"),height&&styles.push("height:"+height);var border=ed.getParam("table_default_border","");"html5"==ed.settings.schema&&ed.settings.validate&&border&&(border=1);var html="<table";""!=border&&(html+=' border="'+border+'"');var align=ed.getParam("table_default_align",""),classes=ed.getParam("table_classes","");""!=align&&"html4"===ed.settings.schema&&(html+=' align="'+align+'"'),""!=align&&"html4"!==ed.settings.schema&&("center"===align?(styles.push("margin-left: auto"),styles.push("margin-right: auto")):styles.push("float: "+align)),classes&&(html+=' class="'+classes+'"'),styles.length&&(html+=' style="'+styles.join(";")+';"'),html+=">";for(var rows=tinymce.grep(DOM.select("tr",table),function(row){return DOM.select("td.selected",row).length}),y=0;y<rows.length;y++){html+="<tr>";for(var cols=DOM.select("td.selected",rows[y]).length,x=0;x<cols;x++)html+=tinymce.isIE?"<td></td>":'<td><br data-mce-bogus="1"/></td>';html+="</tr>"}return html+="</table>",bookmark&&(ed.selection.moveToBookmark(bookmark),
ed.focus(),bookmark=0),ed.execCommand("mceInsertContent",!1,html),Event.cancel(e)}var t=this,ed=t.editor;if("table_insert"===n){var c=cm.createSplitButton("table_insert",{title:"table.desc",cmd:"mceInsertTable",class:"mce_table"});return c.onRenderMenu.add(function(c,m){var sb,tm,sm;ed.getParam("table_buttons",1)?sb=m.add({onmouseover:menuGridMouseOver,onclick:menuGridClick,html:createMenuGrid(8,8)}):(tm=m.addMenu({title:"table.desc",icon:"table",cmd:"mceInsertTable"}),sb=tm.add({onmouseover:menuGridMouseOver,onclick:menuGridClick,html:createMenuGrid(8,8)})),m.onShowMenu.add(function(){(n=DOM.get(sb.id))&&(DOM.removeClass(DOM.select(".mceTableSplitMenu td",n),"selected"),DOM.setHTML(DOM.select(".mceTableSplitMenu .mceTableGridCount",n),"&nbsp;"));var n,se=ed.selection,el=se.getNode(),p=DOM.getParent(el,"table");tinymce.walk(m,function(o){return o!==sb&&o!==tm&&void(o.settings.cmd&&o.setDisabled(!p))},"items",m)}),ed.getParam("table_buttons",1)||(m.add({title:"table.del",icon:"delete_table",cmd:"mceTableDelete"}),m.addSeparator(),sm=m.addMenu({title:"table.cell"}),sm.add({title:"table.cell_desc",icon:"cell_props",cmd:"mceTableCellProps"}),sm.add({title:"table.split_cells_desc",icon:"split_cells",cmd:"mceTableSplitCells"}),sm.add({title:"table.merge_cells_desc",icon:"merge_cells",cmd:"mceTableMergeCells"}),sm=m.addMenu({title:"table.row"}),sm.add({title:"table.row_desc",icon:"row_props",cmd:"mceTableRowProps"}),sm.add({title:"table.row_before_desc",icon:"row_before",cmd:"mceTableInsertRowBefore"}),sm.add({title:"table.row_after_desc",icon:"row_after",cmd:"mceTableInsertRowAfter"}),sm.add({title:"table.delete_row_desc",icon:"delete_row",cmd:"mceTableDeleteRow"}),sm.addSeparator(),sm.add({title:"table.cut_row_desc",icon:"cut",cmd:"mceTableCutRow"}),sm.add({title:"table.copy_row_desc",icon:"copy",cmd:"mceTableCopyRow"}),sm.add({title:"table.paste_row_before_desc",icon:"paste",cmd:"mceTablePasteRowBefore"}),sm.add({title:"table.paste_row_after_desc",icon:"paste",cmd:"mceTablePasteRowAfter"}),sm=m.addMenu({title:"table.col"}),sm.add({title:"table.col_before_desc",icon:"col_before",cmd:"mceTableInsertColBefore"}),sm.add({title:"table.col_after_desc",icon:"col_after",cmd:"mceTableInsertColAfter"}),sm.add({title:"table.delete_col_desc",icon:"delete_col",cmd:"mceTableDeleteCol"}))}),c}return null}}),tinymce.PluginManager.add("table",tinymce.plugins.TablePlugin)}(tinymce);