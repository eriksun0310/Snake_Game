const canvas  = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
//getContext() method 會回傳一個canvas的drawing context
// drawing context 可以用來在canvas內畫圖

const unit = 20
const row = canvas.height / unit  //  320 / 20 = 16
const column = canvas.width / unit //  320 / 20 = 16


let snake = []; // array 中的每個元素,都是一個物件


//
function createSnake(){
    // 物件儲存的是, 身體的 x, y座標
    snake[0] ={
        x:80,
        y:0
    }
    snake[1] ={
        x:60,
        y:0
    }
    snake[2] ={
        x:40,
        y:0
    }
    snake[3] ={
        x:20,
        y:0
    }
}


// 製作果實class
class Fruit{
    // 產生隨機的果實座標
    constructor(){
        this.x = Math.floor(Math.random()* column) * unit
        this.y = Math.floor(Math.random()* row) * unit
    }
    //畫出果實
    drawFruit(){
        ctx.fillStyle="yellow"
        ctx.fillRect(this.x, this.y, unit, unit)
    }
    //選定果實新位置
    pickALocation(){

        let overlapping = false
        let new_x;
        let new_y;

        //檢查snake 的位置有沒有重疊
        function checkOverlap(new_x, new_y){
            for(let i = 0 ; i < snake.length ;  i++){
                  //果實選到跟snake 身體 一樣的位置
                if(new_x === snake[i].x && new_y === snake[i].y){
                    overlapping  = true 
                    return
                }else{
                    overlapping  = false 
                }
            }
        }


        // do 去做的事：一直去檢查果實有沒有跟snake 的身體重疊
        do{
            new_x = Math.floor(Math.random()* column) * unit
            new_y = Math.floor(Math.random()* row) * unit
            checkOverlap(new_x, new_y)
        }while(overlapping) // 當無重疊則跳出do 
        
        this.x = new_x
        this.y = new_y
    }
}
// 初始snake設定
createSnake();
let myFruit = new Fruit()

window.addEventListener("keydown" , changeDirection)
let d = "Right"

// 方向鍵控制snake 方向
function changeDirection(e){
    if(e.key === 'ArrowRight' && d!= "Left"){
        d="Right"
    }else if(e.key === 'ArrowDown' && d!="Up"){
        d="Down"
    }else if(e.key === 'ArrowLeft' &&  d!="Right" ){
        d="Left"
    }else if(e.key === 'ArrowUp' && d!="Down"){
        d="Up"
    }

    /*
    每次按方向鍵之後,在下一幀被畫出來之前
    不接受任何keydown 事件
    這樣可以防止連續按鍵,導致snake在邏輯上自殺
    */
    window.removeEventListener("keydown", changeDirection)
}
let highestScore;
loadHighestScore()
let score  = 0
document.getElementById("myScore").innerHTML = "Game Score：" + score
document.getElementById("myScore2").innerHTML = "Highest Score：" + highestScore




function draw(){
    //每次畫圖之前,確認snake 有沒有咬到自己
    for(let i = 1; i<snake.length ; i++ ){
        if(snake[i].x === snake[0].x  && snake[i].y === snake[0].y){
            clearInterval(myGame)
            alert("Game Over")
            return
        }
    }

    //背景全設定為黑色
    ctx.fillStyle ="black"
    ctx.fillRect(0,0,canvas.width, canvas.height)

    myFruit.drawFruit()
    // 畫出snake
    for(let i =0 ; i < snake.length; i++){
        //給snake 上色
        if(i=== 0){
            ctx.fillStyle ="lightgreen"
        }else{
            ctx.fillStyle ="lightblue"
        }
        //外寬
        ctx.strokeStyle = "white"


        //snake超出牆的邏輯
        if(snake[i].x >= canvas.width){
            snake[i].x = 0
        }
        if(snake[i].x < 0){
            snake[i].x = canvas.width - unit
        }
        if(snake[i].y >= canvas.height){
            snake[i].y = 0
        }
        if(snake[i].y < 0){
            snake[i].y = canvas.height - unit
        }

        // 真正畫出snake
        //fillRect(x,y,width,height)畫一個實心長方形
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit)
        //畫一個帶有框的長方形在外面
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit)
    }

    //更新snake 的座標(以目前的d變數方向, 來決定蛇的下一幀要放在哪個座標)
    let snakeX = snake[0].x
    let snakeY = snake[0].y
    if(d === "Left"){
        snakeX -= unit
    }else if(d === "Up"){
        snakeY -= unit
    }else if(d === "Right"){
        snakeX += unit
    }else if(d === "Down"){
        snakeY += unit
    }

    let newHead = {
        x:snakeX,    
        y:snakeY,    
    }

    //snake 有吃到果實
    if(snake[0].x ===  myFruit.x && snake[0].y === myFruit.y){
        //重新選定一個新的果實隨機位置
        myFruit.pickALocation()
        //更新分數
        score ++ 
        setHighestScore(score)
        document.getElementById("myScore").innerHTML = "Game Score：" + score
        document.getElementById("myScore2").innerHTML = "Highest Score：" + highestScore

    }else{
        snake.pop()
    }
    snake.unshift(newHead)
    window.addEventListener("keydown" , changeDirection)
}

let myGame = setInterval(draw, 100)

function loadHighestScore(){
    if(localStorage.getItem("highestScore") === null){
        highestScore = 0
    }else{
        highestScore = Number(localStorage.getItem("highestScore"))
    }
}

// 設定瀏覽器的最高分
function setHighestScore(score){
    if(score > highestScore){
        localStorage.setItem("highestScore",score)
        highestScore = score
    }
}
