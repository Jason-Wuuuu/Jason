import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Link, Fade } from "@mui/material";
import confetti from "canvas-confetti";

const MiniGame = ({ onClose, memojiRef, onHighScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // Changed from 10 to 5
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const modalRef = useRef(null);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(5); // Changed from 10 to 5
    setIsPlaying(true);
  }, []);

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
      } else if (timeLeft === 5) {
        // Changed from 10 to 5
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
  }, [memojiRef, isPlaying, timeLeft, startGame]);

  const triggerConfetti = useCallback(() => {
    confetti({
      zIndex: 10000,
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
      onHighScoreUpdate(score); // Add this line to update the parent component
      triggerConfetti();
    }
  }, [score, highScore, triggerConfetti, onHighScoreUpdate]);

  useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, endGame]);

  const getEncouragingMessage = () => {
    if (score === 0) return "Keep on clicking! 👈";
    if (score < 5) return "Not bad, keep going! 👍";
    if (score < 10) return "You're on fire! 🔥";
    return "Wow, you're a clicking machine! 🚀";
  };

  return (
    <Box
      ref={modalRef}
      sx={{
        position: "fixed",
        bgcolor: "#1E1E1E",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: 400,
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
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ textDecoration: "underline" }}
      >
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
              <Typography variant="body1" fontWeight="bold">
                Time left: {timeLeft}s
              </Typography>
              <Typography variant="body1" mt={1} fontWeight="bold">
                Score: {score}
              </Typography>
              <Fade in={true} timeout={1000}>
                <Typography
                  variant="body1"
                  mt={2}
                  color="coral"
                  fontWeight="bold"
                >
                  {getEncouragingMessage()}
                </Typography>
              </Fade>
            </>
          ) : (
            <Box width="100%">
              {timeLeft === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography
                    variant="body1"
                    color="gold"
                    fontWeight={score >= highScore ? "bold" : "normal"}
                    sx={
                      score >= highScore
                        ? {
                            animation: "pulse 1s infinite",
                            "@keyframes pulse": {
                              "0%": { transform: "scale(1)" },
                              "50%": { transform: "scale(1.05)" },
                              "100%": { transform: "scale(1)" },
                            },
                          }
                        : {}
                    }
                  >
                    {score >= highScore && "🎉 New "}High Score: {highScore}
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Final Score: {score}
                  </Typography>
                </Box>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="lightgray"
                    sx={{
                      animation: "pulse 1s infinite",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.05)" },
                        "100%": { transform: "scale(1)" },
                      },
                    }}
                  >
                    ← Click to start!
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        {!isPlaying && timeLeft === 0 && (
          <Link
            component="button"
            variant="body1"
            onClick={startGame}
            sx={{
              fontWeight: "bold",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            Restart! 🔄
          </Link>
        )}
        <Box flexGrow={1} />
        <Link
          component="button"
          variant="body1"
          onClick={onClose}
          color="error"
          sx={{
            fontWeight: "bold",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          Close ❌
        </Link>
      </Box>
    </Box>
  );
};

export default MiniGame;
