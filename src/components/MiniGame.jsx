import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Fade } from "@mui/material";
import confetti from "canvas-confetti";

const MiniGame = ({ onClose, memojiRef }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const modalRef = useRef(null);

  useEffect(() => {
    const memojiRect = memojiRef.current?.getBoundingClientRect();
    const modalElement = modalRef.current;

    if (memojiRect && modalElement) {
      modalElement.style.left = `${memojiRect.right + 20}px`;
      modalElement.style.top = `${memojiRect.top}px`;
    }
  }, [memojiRef]);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    const handleClick = () => {
      if (isPlaying) {
        setScore((prevScore) => prevScore + 1);
      } else if (timeLeft === 10) {
        startGame();
      }
    };

    const memojiElement = memojiRef.current;
    if (memojiElement) {
      memojiElement.addEventListener("click", handleClick);
    }
    return () => {
      if (memojiElement) {
        memojiElement.removeEventListener("click", handleClick);
      }
    };
  }, [memojiRef, isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
      confetti({
        zIndex: 10000,
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft]);

  const getEncouragingMessage = () => {
    if (score === 0) return "Come on, you can do it!";
    if (score < 5) return "Not bad, keep going!";
    if (score < 10) return "You're on fire!";
    return "Wow, you're a clicking machine!";
  };

  return (
    <Box
      ref={modalRef}
      sx={{
        position: "fixed",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: 350,
        height: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: (theme) => theme.zIndex.modal + 1,
        animation: isPlaying ? "pulse 1s infinite" : "none",
        "@keyframes pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      }}
    >
      <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
        Memoji Clicker!
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          display="flex"
          width="100%"
          flexDirection="column"
          alignItems="center"
        >
          {isPlaying ? (
            <>
              <Typography variant="body1">Time left: {timeLeft}s</Typography>
              <Typography variant="body1">Score: {score}</Typography>
              <Fade in={true} timeout={1000}>
                <Typography variant="body2" mt={2} color="primary">
                  {getEncouragingMessage()}
                </Typography>
              </Fade>
            </>
          ) : (
            <Box>
              {timeLeft === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="body2">Final Score: {score}</Typography>
                  <Typography
                    variant="body2"
                    color={score > highScore ? "gold" : "inherit"}
                    sx={{ mt: 1 }}
                  >
                    {score > highScore
                      ? "New High Score! 🎉"
                      : `High Score: ${highScore}`}
                  </Typography>
                </Box>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Typography
                    variant="h5"
                    sx={{ mr: 1, color: "primary.main" }}
                  >
                    ←
                  </Typography>
                  <Typography variant="body2">Click to start!</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {!isPlaying && timeLeft === 0 && (
          <Button variant="contained" onClick={startGame} sx={{ mr: 1 }}>
            Try Again!
          </Button>
        )}
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default MiniGame;
