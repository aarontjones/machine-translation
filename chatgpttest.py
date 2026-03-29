# minimal_transformer_mt.py
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer

# --------------------------
# 1. Configuration
# --------------------------
SRC_LANG = 'en'
TGT_LANG = 'fr'
MAX_LEN = 20
BATCH_SIZE = 32
EPOCHS = 5
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --------------------------
# 2. Tiny dataset example
# --------------------------
# Replace this with your Tatoeba or small corpus
data_pairs = [
    ("I am happy.", "Je suis heureux."),
    ("Hello world!", "Bonjour le monde!"),
    ("Good morning.", "Bonjour."),
    ("Thank you.", "Merci."),
    ("I love you.", "Je t'aime."),
]

# --------------------------
# 3. Tokenizer
# --------------------------
tokenizer_src = AutoTokenizer.from_pretrained("t5-small")  # English tokenizer
tokenizer_tgt = AutoTokenizer.from_pretrained("t5-small")  # French tokenizer

# --------------------------
# 4. Dataset
# --------------------------
class TranslationDataset(Dataset):
    def __init__(self, pairs):
        self.pairs = pairs

    def __len__(self):
        return len(self.pairs)

    def __getitem__(self, idx):
        src_text, tgt_text = self.pairs[idx]
        src = tokenizer_src(src_text, return_tensors="pt", padding="max_length",
                            truncation=True, max_length=MAX_LEN).input_ids.squeeze()
        tgt = tokenizer_tgt(tgt_text, return_tensors="pt", padding="max_length",
                            truncation=True, max_length=MAX_LEN).input_ids.squeeze()
        return src, tgt

dataset = TranslationDataset(data_pairs)
dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

# --------------------------
# 5. Model
# --------------------------
class TinyTransformer(nn.Module):
    def __init__(self, vocab_size_src, vocab_size_tgt, d_model=256, nhead=4,
                 num_encoder_layers=3, num_decoder_layers=3, dim_feedforward=512, dropout=0.1):
        super().__init__()
        self.src_embed = nn.Embedding(vocab_size_src, d_model)
        self.tgt_embed = nn.Embedding(vocab_size_tgt, d_model)
        self.pos_encoder = nn.Sequential()  # skip fancy positional encoding for minimal
        self.transformer = nn.Transformer(d_model=d_model, nhead=nhead,
                                          num_encoder_layers=num_encoder_layers,
                                          num_decoder_layers=num_decoder_layers,
                                          dim_feedforward=dim_feedforward,
                                          dropout=dropout)
        self.fc_out = nn.Linear(d_model, vocab_size_tgt)

    def forward(self, src, tgt):
        # src: (S, N), tgt: (T, N)
        src = self.src_embed(src) * (src.shape[-1] ** 0.5)
        tgt = self.tgt_embed(tgt) * (tgt.shape[-1] ** 0.5)
        src = src.transpose(0,1)  # (S,N,E) -> (S,N,E)
        tgt = tgt.transpose(0,1)
        output = self.transformer(src, tgt)
        output = self.fc_out(output)
        return output.transpose(0,1)  # (N, T, vocab_size)

# Initialize model
vocab_size_src = tokenizer_src.vocab_size
vocab_size_tgt = tokenizer_tgt.vocab_size
model = TinyTransformer(vocab_size_src, vocab_size_tgt).to(DEVICE)

# --------------------------
# 6. Loss & Optimizer
# --------------------------
criterion = nn.CrossEntropyLoss(ignore_index=tokenizer_tgt.pad_token_id)
optimizer = optim.Adam(model.parameters(), lr=1e-4)

# --------------------------
# 7. Training Loop
# --------------------------
for epoch in range(EPOCHS):
    model.train()
    total_loss = 0
    for src, tgt in dataloader:
        src, tgt = src.to(DEVICE), tgt.to(DEVICE)
        tgt_input = tgt[:, :-1]
        tgt_output = tgt[:, 1:]

        optimizer.zero_grad()
        output = model(src, tgt_input)
        loss = criterion(output.reshape(-1, vocab_size_tgt), tgt_output.reshape(-1))
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    print(f"Epoch {epoch+1} Loss: {total_loss/len(dataloader):.4f}")

# --------------------------
# 8. Simple Evaluation
# --------------------------
def translate_sentence(sentence):
    model.eval()
    with torch.no_grad():
        src = tokenizer_src(sentence, return_tensors="pt",
                            padding="max_length", truncation=True,
                            max_length=MAX_LEN).input_ids.to(DEVICE)
        tgt_indices = [tokenizer_tgt.pad_token_id] * MAX_LEN
        tgt_indices[0] = tokenizer_tgt.bos_token_id or tokenizer_tgt.cls_token_id
        tgt_tensor = torch.tensor([tgt_indices], device=DEVICE)
        for i in range(1, MAX_LEN):
            output = model(src, tgt_tensor[:, :i])
            next_token = output[0, i-1].argmax().item()
            tgt_tensor[0, i] = next_token
            if next_token == tokenizer_tgt.eos_token_id:
                break
        return tokenizer_tgt.decode(tgt_tensor[0], skip_special_tokens=True)

# Test translation
test_sentence = "I am happy."
print("EN:", test_sentence)
print("FR:", translate_sentence(test_sentence))