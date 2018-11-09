import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {


  renderSquare(i, isWinner) {
    let winnerClass;
    isWinner ? winnerClass = 'square winner-square' : winnerClass = "square";
    return <Square key={i} className={winnerClass} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  


  renderBoard() {
    let boardRows = [];
    let squareCount = 0;

    for (let i = 0; i < 3; i++){
      let children = [];

      for (let j = 0; j < 3; j++) {
        let isWinner = false;
        if (this.props.winners) {
          isWinner = (this.props.winners.indexOf(squareCount) > -1);
        }
        
        children.push(this.renderSquare(squareCount, isWinner));
        squareCount++;
      }
      boardRows.push(<div key={i} className="board-row">{children}</div>)
    }

    return boardRows;
  }


  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      listOrdering: false,
    };
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  getRowAndColumn(current, previous){

    let i, currentChar;

    for (let j = 0; j<10; j++){
      if (current.squares[j] !== previous.squares[j]){
        i = j; 
        currentChar = current.squares[j]; 
      }
    }

    let currentCol = i % 3;
    let currentRow = parseInt(i / 3);
    return " : " + currentChar + " to Column " + (currentCol + 1) + ", Row " + (currentRow + 1);
  }


  sortOrder = () => {
    let listOder = !this.state.listOrdering;
    this.setState({
      listOrdering: listOder
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + this.getRowAndColumn(history[move], history[move - 1]) :
        'Go to game start';

      const currentMove = this.state.stepNumber === move ? 'currentMove' : ''; 

      return (
        <li key={move}>
          <button className={currentMove} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status, realWinners;

    if(this.state.stepNumber === 9 && !winner)
    {
      status = "DRAW!";
    } else if (winner) {
      status = 'Winner: ' + winner[0];
      realWinners = winner[1];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let reverseClass;

    this.state.listOrdering ? reverseClass = 'ol-reverse' : reverseClass = '';

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winners={realWinners} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={this.sortOrder}>Ascending / Descending order</button>
          <ol className={reverseClass}>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let winnerLine = [];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winnerLine = [squares[a], lines[i]];
      return winnerLine;
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
