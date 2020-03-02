/**************************
 * HTML MAPPING FUNCTIONS 
***************************/
function maze_Binary(mazeTable, maxColumns, maxRows) {
    var northRow = maxRows - 1;
    var eastColumn = maxColumns - 1;

    // outer loop - ROWS
    for(i=0;i<maxRows;i++) {
        // inner loop - COLUMNS
        for(x=0;x<maxColumns;x++) {
            var cell = $("#" + mazeTable + " td[data-row='" + i + "'][data-col='" + x +"']");
            var northCell = $("#" + mazeTable + " td[data-row='" + (i + 1) + "'][data-col='" + x +"']");
            var eastCell = $("#" + mazeTable + " td[data-row='" + i + "'][data-col='" + (x + 1) +"']");
            // check for exit cell
            if(!(i==northRow && x==eastColumn)) {
                if(x==eastColumn) { // this is the far right column, always proceed north
                    $(northCell).css("border-bottom", "none");
                    if(i != northRow) {$(cell).css("border-top", "none");};  
                }else if (i==northRow) { // this is the top row, always proceed east
                   $(eastCell).css("border-left", "none");
                    if(x != eastColumn) {$(cell).css("border-right", "none");};
                }else if(coinFlip()) { //check the coin flip to get some direction
                    $(northCell).css("border-bottom", "none");
                    if(i != northRow) {$(cell).css("border-top", "none");};
                }else {
                     $(eastCell).css("border-left", "none");
                    if(x != eastColumn) {$(cell).css("border-right", "none");};
                };
            
            }
        }
    }
}; // end function maze_Binary(mazeTable, maxColumns, maxRows)

function maze_Sidewinder(mazeTable, maxColumns, maxRows) {
    var northRow = maxRows - 1;
    var eastColumn = maxColumns - 1;
    var runCount = 1;

    // outer loop - ROWS
    for(i=0;i<maxRows;i++) {
        // inner loop - COLUMNS
        for(x=0;x<maxColumns;x++) {
            var cell = $("#" + mazeTable + " td[data-row='" + i + "'][data-col='" + x +"']");
            var northCell = $("#" + mazeTable + " td[data-row='" + (i + 1) + "'][data-col='" + x +"']");
            var eastCell = $("#" + mazeTable + " td[data-row='" + i + "'][data-col='" + (x + 1) +"']");
            // check for exit cell
            if(!(i==northRow && x==eastColumn)) {
                if(x==eastColumn) { // this is the far right column
                    if(runCount > 1) {
                        var r = randomRun(runCount) - 1;
                        cell = $("#" + mazeTable + " td[data-row='" + i + "'][data-col='" + (x-r) +"']");
                        northCell = $("#" + mazeTable + " td[data-row='" + (i + 1) + "'][data-col='" + (x-r) +"']");
                    };
                    $(northCell).css("border-bottom", "none");
                    if(i != northRow) {$(cell).css("border-top", "none");}; 
                    runCount = 1;
                }else if (i==northRow) { // this is the top row, always proceed east
                   $(eastCell).css("border-left", "none");
                    if(x != eastColumn) {$(cell).css("border-right", "none");};
                    runCount = 1;
                }else if(coinFlip()) { //check the coin flip to get some direction
                    if(runCount > 1) {
                        var r = randomRun(runCount) - 1;
                        cell = $("#" + mazeTable + " td[data-row='" + i + "'][data-col='" + (x-r) +"']");
                        northCell = $("#" + mazeTable + " td[data-row='" + (i + 1) + "'][data-col='" + (x-r) +"']");
                    };
                    $(northCell).css("border-bottom", "none");
                    if(i != northRow) {$(cell).css("border-top", "none");};
                    runCount = 1;
                }else {
                     $(eastCell).css("border-left", "none");
                    if(x != eastColumn) {$(cell).css("border-right", "none");};
                    runCount += 1
                };
            
            }
        }
    }
}; // end function maze_Sidewinder(mazeTable, maxColumns, maxRows)

function maze_AldousBroder(mazeTable, maxColumns, maxRows) {
    var northRow = maxRows - 1;
    var eastColumn = maxColumns - 1;
    var cellCount = maxColumns * maxRows;
    var visitedCells = 1;

    var i = randomRun(maxRows) - 1; // starting cell row
    var x = randomRun(maxColumns) - 1; // starting cell column
    var cell = $("#" + mazeTable + " td[data-row='" + i + "'][data-col='" + x +"']");
    var nextCell;

    var moves = 4;
    var move = 0;
    var direction;

    var visited = false;
    var canMoveUp = true;
    var canMoveDown = true;
    var canMoveRight = true;
    var canMoveLeft = true;


    while(visitedCells < cellCount) {
        // determine where we can move
        if(0 == i) { canMoveDown = false;moves-=1;} // can't move down
        if(0 == x) { canMoveLeft = false;moves-=1;} // can't move left
        if(northRow == i) { canMoveUp = false;moves-=1;} // can't move up
        if(eastColumn == x) { canMoveRight = false;moves-=1;} //can't move right
                
        //mark the current cell as visited if it's not already visited
        $(cell).attr("data-visited", "true");
        
        // this should be an impossible situation, but still worth checking
        if(moves > 0) {
            move = randomRun(moves);
            switch(move) {
                case 1: 
                    if(canMoveUp) { i += 1;direction="up";} else { i-=1;direction="down";}; break;
                case 3: 
                    if(canMoveDown) { i -= 1;direction="down";} else { i+=1;direction="up";}; break;
                case 2: 
                    if(canMoveRight) { x += 1;direction="right";} else { x-=1;direction="left";}; break;
                case 4: 
                    if(canMoveLeft) { x -= 1;direction="left";} else { x+=1;direction="right";}; break;
            }            
            
            nextCell = $("#" + mazeTable + " td[data-row='" + i + "'][data-col='" + x +"']");
            
            if($(nextCell).attr("data-visited") != "true") {
                //okay, we haven't visited the next cell so we need to knock down the borders
                visitedCells += 1;
                switch(direction) {
                    case "up":
                        $(cell).css("border-top", "none");
                        $(nextCell).css("border-bottom", "none");
                        break;
                    case "down":
                        $(cell).css("border-bottom", "none");
                        $(nextCell).css("border-top", "none");
                        break;
                    case "right":
                        $(cell).css("border-right", "none");
                        $(nextCell).css("border-left", "none");
                        break;
                    case "left":
                        $(cell).css("border-left", "none");
                        $(nextCell).css("border-right", "none");
                        break;
                }
            }
            //move the active cell to the next cell
            cell = nextCell;
        }

        //reset variables for the next time through
        moves = 4;
        canMoveUp = true;
        canMoveDown = true;
        canMoveRight = true;
        canMoveLeft = true;
    };    
}; // end function 
/**************************
 * END HTML MAPPING FUNCTIONS 
***************************/

/**************************
 * ARRAY MAPPING FUNCTIONS 
***************************/
function mapArray(rows, columns) {
    // create a multidimensional array    
    var map = new Array(parseInt(rows)); // determine rows for map
    for(var i = 0; i < map.length; i++)
        map[i] = new Array(parseInt(columns)); // determine columns
    // Initialize the array
    for(var countRow = 0; countRow < map.length; countRow++) {
        for(var countCol = 0; countCol < map[countRow].length; countCol++) {            
            var mazeCell = {
                exit: false
                , entrance: false
                , borderTop: true
                , borderBottom: true  
                , borderRight: true
                , borderLeft: true
                , djSteps: 0
                , onPath: false  
                , visited: false
                , column: 0
                , row: 0
            }                                             
            map[countRow][countCol] = mazeCell;
        }
    }
    

    return AldousBroderArray(map);
}; // end function mapArray(rows, columns)

function AldousBroderArray(map) {
    
    var northRow = map.length - 1;
    var eastColumn = map[0].length - 1;
    var cellCount = map[0].length * map.length;
    var visitedCells = 1;

    var i = randomRun(map.length) - 1; // starting cell row
    var x = randomRun(map[0].length) - 1; // starting cell column
    //console.log("starting...");
    //console.log("i: " + i + ", x: " + x);
    var next_i;
    var next_x;
    var cell = map[i][x];
    var nextCell;

    var moves = 4;
    var move = 0;
    var direction;
    var canMoveUp = true;
    var canMoveDown = true;
    var canMoveRight = true;
    var canMoveLeft = true;

    console.log("AldousBroderArray(map) - starting loop...");
    
    while(visitedCells < cellCount) {

        
        // determine where we can move
        cell.column = x;
        cell.row = i;

        if(0 == i) { cell.borderBottom = true; canMoveDown = false;moves-=1;} // can't move down
        if(0 == x) { cell.borderLeft = true; canMoveLeft = false;moves-=1;} // can't move left
        if(northRow == i) { cell.borderTop = true; canMoveUp = false;moves-=1;} // can't move up
        if(eastColumn == x) { cell.borderRight = true; canMoveRight = false;moves-=1;} //can't move right
                
        //mark the current cell as visited if it's not already visited
        cell.visited = true;
        

        if(0 == i && 0 == x) { cell.entrance = true; }
        if(i == (map.length - 1) && x == (map[0].length - 1)) { cell.exit = true; }
        
        // this should be an impossible situation, but still worth checking
        if(moves > 0) {
            next_i = i;
            next_x = x;
            move = randomRun(moves);
            //debugger;
            switch(move) {
                case 1: 
                    if(canMoveUp) { next_i += 1;direction="up";} else { next_i -= 1;direction="down";}; break;
                case 3: 
                    if(canMoveDown) { next_i -= 1;direction="down";} else { next_i += 1;direction="up";}; break;
                case 2: 
                    if(canMoveRight) { next_x += 1;direction="right";} else { next_x -= 1;direction="left";}; break;
                case 4: 
                    if(canMoveLeft) { next_x -= 1;direction="left";} else { next_x += 1;direction="right";}; break;
            }            
                
            if (next_i == i && next_x == x) {console.log("ALERT!!!! i: " + i + ", x: " + x + ", next_i: " + next_i + ", next_x: " + next_x);}
            
            nextCell = map[next_i][next_x];

            if(!nextCell.visited) {
                //okay, we haven't visited the next cell so we need to knock down the borders
                visitedCells += 1;
                switch(direction) {
                    case "up":
                        cell.borderTop = false;
                        nextCell.borderBottom = false;
                        break;
                    case "down":
                        cell.borderBottom = false;
                        nextCell.borderTop = false;
                        break;
                    case "right":
                        cell.borderRight = false;
                        nextCell.borderLeft = false;
                        break;
                    case "left":
                        cell.borderLeft = false;
                        nextCell.borderRight = false;
                        break;
                }

                if(0 == next_i && 0 == next_x) { nextCell.entrance = true;}
                if(next_i == (map.length - 1) && next_x == (map[0].length - 1)) { nextCell.exit = true;}
            } 
            //move the active cell to the next cell
            map[i][x] = cell;
            map[next_i][next_x] = nextCell;

            i = next_i;
            x = next_x;
            cell = map[i][x];
        }

        //reset variables for the next time through
        canMoveUp = true;
        canMoveDown = true;
        canMoveRight = true;
        canMoveLeft = true;
        moves = 4;
    };   


    // determine dj path
    // reset variables
    i = 0;
    x = 0;
    var global_djSteps = 1;
    var current_djSteps = 1;
    visitedCells = 0;
    canMoveUp = true;
    canMoveDown = true;
    canMoveRight = true;
    canMoveLeft = true;

    // resets "visited" marker
    for(var q=0;q<map.length;q++) {
        for(var u=0;u<map[q].length;u++) {
            map[q][u].visited = false;
            if(map[q][u].entrance) {map[q][u].djSteps = global_djSteps;}
        }
    } 
    // start at "entrance"
    cell = map[i][x];
    var canMove = false;
    var global_canMove = true;

    while(global_canMove) {
        //console.log(global_djSteps);
        for(var r=0;r<map.length;r++) {
            for(var c=0;c<map[r].length;c++) {
                if(map[r][c].djSteps == global_djSteps) {
                    cell=map[r][c];
                    if(!cell.borderTop && map[r+1][c].djSteps == 0) {
                        map[r+1][c].djSteps = global_djSteps + 1;
                        canMove = true;
                    }
                    if(!cell.borderRight && map[r][c+1].djSteps == 0) {
                        map[r][c+1].djSteps = global_djSteps + 1;
                        canMove = true;
                    }
                    if(!cell.borderBottom && map[r-1][c].djSteps == 0) {
                        map[r-1][c].djSteps = global_djSteps + 1;
                        canMove = true;
                    }
                    if(!cell.borderLeft && map[r][c-1].djSteps == 0) {
                        map[r][c-1].djSteps = global_djSteps + 1;
                        canMove = true;
                    }

                    if(canMove) {
                        canMove = false;
                    }
                }
            }
        }

        global_canMove = false;
        for(var r=0;r<map.length;r++) {
            for(var c=0;c<map[r].length;c++) {
                if(map[r][c].djSteps == 0) {global_canMove = true;}
            }
        }
        
        global_djSteps += 1;
    }

    // now that we've set the dj steps we can set the path
    // reset some variables
    for(var r=0;r<map.length;r++) {
        for(var c=0;c<map[r].length;c++) {
            if(map[r][c].exit) {
                global_djSteps = map[r][c].djSteps;
                cell = map[r][c];
            };
        };
    };

    var next_djSteps = global_djSteps - 1;
    column = cell.column;
    row = cell.row;

    while(global_djSteps>0) {
        cell.onPath = true;
        map[row][column] = cell;
        if(!cell.borderTop && map[row+1][column].djSteps == next_djSteps) {
            row += 1;
            global_djSteps -= 1;
        } else if(!cell.borderRight && map[row][column+1].djSteps == next_djSteps) {
            column += 1;
            global_djSteps -= 1;
        } else if(!cell.borderBottom && map[row-1][column].djSteps == next_djSteps) {
            row -= 1;
            global_djSteps -= 1;
        } else if(!cell.borderLeft && map[row][column-1].djSteps == next_djSteps) {
            column -= 1;
            global_djSteps -= 1;
        } else if(cell.entrance) {
            global_djSteps = 0;
        }

        cell = map[row][column];
        next_djSteps = global_djSteps - 1;
    }


    return map;
}; // end function AldousBroderArray(map);
/**************************
 * END ARRAY MAPPING FUNCTIONS 
***************************/

/**************************
 * HELPER FUNCTIONS 
***************************/
function customTableFromArray(tbl, map) {
    var rows = map.length;
    var rowCount = 0
    var columns = map[0].length;
    var cell;


    for(var r=rows - 1;r>=0;r--) { 
        var x=document.getElementById(tbl).insertRow(rowCount);
        for(var c=0;c<parseInt(columns,10);c++) {
            cell = map[r][c];
                        
            var y=  x.insertCell(c);     
            $(y).attr("data-row", (rows - rowCount - 1));
            $(y).attr("data-col", c);
            $(y).attr("data-djsteps", cell.djSteps);
            //$(y).text(cell.djSteps);

            if(cell.onPath) {$(y).attr("class", "onpath");}

            //
            if(cell.borderTop) {y.style.borderTop = "1px solid black";};
            if(cell.borderRight) {y.style.borderRight = "1px solid black";};
            if(cell.borderBottom) {y.style.borderBottom = "1px solid black";};
            if(cell.borderLeft) {y.style.borderLeft = "1px solid black";};

            if(cell.entrance) {
                $(y).attr("id", "entrance");
            }else if(cell.exit) {
                $(y).attr("id", "exit");
            };
            
            //debugger;
        };
        rowCount += 1;
    };
}; // end function customTableFromArray(tbl, map)

function coinFlip() {
    return Math.random() >= 0.5;
}; // end function coinFlip();

function randomRun(runCount) {
    return Math.floor(Math.random() * runCount) + 1 
}; // end function randomRun(runCount);

function customTable(tbl, rows, columns) {
    for(var r=0;r<parseInt(rows,10);r++) { 
        var x=document.getElementById(tbl).insertRow(r);
        for(var c=0;c<parseInt(columns,10);c++) {
            var y=  x.insertCell(c);     
            $(y).attr("data-row", (rows - r - 1));
            $(y).attr("data-col", c);

            if(c==0 && (rows - r - 1)==0) {
                $(y).attr("id", "entrance");
            }else if(c==(columns - 1) && r==0) {
                $(y).attr("id", "exit");
            };
        };
    };
}; // end function customTable(tbl, rows, columns)
/**************************
 * END HELPER FUNCTIONS 
***************************/